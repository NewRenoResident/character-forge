"use server";
import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import sharp from "sharp";

// Создаем папки
const uploadDir = path.join(process.cwd(), "public/uploads");
const tempDir = path.join(process.cwd(), "public/temp");

// Вспомогательная функция для обеспечения существования директорий
async function ensureDirsExist() {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  try {
    await fs.access(tempDir);
  } catch {
    await fs.mkdir(tempDir, { recursive: true });
  }
}

// Быстрая загрузка с отложенной обработкой
export async function uploadImageFast(file: File) {
  try {
    await ensureDirsExist();

    if (!file) {
      return { error: "Файл не предоставлен" };
    }

    // Проверяем размер файла (10MB максимум)
    if (file.size > 10 * 1024 * 1024) {
      return { error: "Файл слишком большой (максимум 10MB)" };
    }

    // Проверяем тип файла
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        error: "Неподдерживаемый тип файла. Разрешены: JPG, PNG, GIF, WebP",
      };
    }

    // Читаем файл в буфер
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Создаем хеш для уникального имени
    const hash = createHash("sha256").update(buffer).digest("hex");
    const originalFilename = `${hash}_original${path.extname(file.name)}`;
    const webpFilename = `${hash}.webp`;

    // Сохраняем оригинал во временную папку (быстро)
    const tempFilepath = path.join(tempDir, originalFilename);
    await fs.writeFile(tempFilepath, buffer);

    // Формируем URL и путь к финальному файлу
    const fileUrl = `/uploads/${webpFilename}`;
    const finalFilepath = path.join(uploadDir, webpFilename);

    // Проверяем, существует ли уже обработанный файл
    let fileExists = false;
    try {
      await fs.access(finalFilepath);
      fileExists = true;
      // Если файл существует, удаляем временный
      await fs.unlink(tempFilepath);
    } catch {
      // Файл не существует, нужна обработка
    }

    if (fileExists) {
      return {
        success: true,
        url: fileUrl,
        filename: webpFilename,
        processing: false, // Файл уже готов
      };
    }

    // Запускаем асинхронную обработку (не ждем завершения)
    processImageAsync(tempFilepath, webpFilename).catch(console.error);

    return {
      success: true,
      url: fileUrl,
      filename: webpFilename,
      processing: true, // Флаг, что изображение обрабатывается
    };
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    return { error: "Ошибка сервера при загрузке файла" };
  }
}

// Асинхронная обработка изображения
async function processImageAsync(tempFilepath: string, webpFilename: string) {
  try {
    const outputPath = path.join(uploadDir, webpFilename);

    // Конвертируем в WebP
    await sharp(tempFilepath).webp({ quality: 80 }).toFile(outputPath);

    // Удаляем временный файл
    await fs.unlink(tempFilepath);

    console.log(`Изображение обработано: ${webpFilename}`);

    // Здесь можно добавить уведомление пользователя (WebSocket, SSE, etc.)
  } catch (error) {
    console.error("Ошибка обработки изображения:", error);

    // Очищаем временный файл в случае ошибки
    try {
      await fs.unlink(tempFilepath);
    } catch {}
  }
}

// Проверка статуса обработки
export async function checkImageStatus(filename: string) {
  try {
    const filepath = path.join(uploadDir, filename);
    await fs.access(filepath);
    return { ready: true };
  } catch {
    return { ready: false, processing: true };
  }
}

// Альтернативный подход: сначала оригинал, потом WebP
export async function uploadImageWithFallback(file: File) {
  try {
    await ensureDirsExist();

    if (!file) {
      return { error: "Файл не предоставлен" };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { error: "Файл слишком большой (максимум 10MB)" };
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        error: "Неподдерживаемый тип файла. Разрешены: JPG, PNG, GIF, WebP",
      };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const hash = createHash("sha256").update(buffer).digest("hex");

    // Сохраняем оригинал сразу (для немедленного доступа)
    const originalExt = path.extname(file.name);
    const originalFilename = `${hash}_original${originalExt}`;
    const originalPath = path.join(uploadDir, originalFilename);
    await fs.writeFile(originalPath, buffer);

    const webpFilename = `${hash}.webp`;
    const originalUrl = `/uploads/${originalFilename}`;
    const webpUrl = `/uploads/${webpFilename}`;
    const webpPath = path.join(uploadDir, webpFilename);

    // Проверяем, существует ли уже WebP версия
    let webpExists = false;
    try {
      await fs.access(webpPath);
      webpExists = true;
    } catch {
      // WebP не существует
    }

    if (webpExists) {
      // WebP уже есть, удаляем оригинал и возвращаем WebP
      await fs.unlink(originalPath);
      return {
        success: true,
        url: webpUrl,
        webpUrl: webpUrl,
        filename: webpFilename,
        webpFilename: webpFilename,
        processing: false,
      };
    }

    // Запускаем конвертацию в WebP асинхронно
    convertToWebPAsync(originalPath, webpFilename, originalFilename).catch(
      console.error
    );

    return {
      success: true,
      url: originalUrl, // Сначала возвращаем оригинал
      webpUrl: webpUrl, // URL для WebP версии
      filename: originalFilename,
      webpFilename: webpFilename,
      processing: true,
    };
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    return { error: "Ошибка сервера при загрузке файла" };
  }
}

// Конвертация в WebP с удалением оригинала
async function convertToWebPAsync(
  originalPath: string,
  webpFilename: string,
  originalFilename: string
) {
  try {
    const webpPath = path.join(uploadDir, webpFilename);

    await sharp(originalPath).webp({ quality: 80 }).toFile(webpPath);

    // Опционально: удаляем оригинал после успешной конвертации
    // await fs.unlink(originalPath);

    console.log(`WebP версия создана: ${webpFilename}`);
  } catch (error) {
    console.error("Ошибка конвертации в WebP:", error);
  }
}

// Оригинальная функция (для сравнения)
export async function uploadImageSync(file: File) {
  try {
    await ensureDirsExist();

    if (!file) {
      return { error: "Файл не предоставлен" };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { error: "Файл слишком большой (максимум 10MB)" };
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        error: "Неподдерживаемый тип файла. Разрешены: JPG, PNG, GIF, WebP",
      };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const hash = createHash("sha256").update(buffer).digest("hex");
    const filename = `${hash}.webp`;
    const filepath = path.join(uploadDir, filename);

    // Конвертируем изображение в WebP и сохраняем его (МЕДЛЕННО)
    await sharp(buffer).webp({ quality: 80 }).toFile(filepath);

    const fileUrl = `/uploads/${filename}`;

    return {
      success: true,
      url: fileUrl,
      filename: filename,
    };
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    return { error: "Ошибка сервера при загрузке файла" };
  }
}

export async function deleteImage(filename: string) {
  try {
    if (!filename) {
      return { error: "Имя файла не предоставлено" };
    }

    const filepath = path.join(uploadDir, filename);
    await fs.unlink(filepath);

    // Также удаляем из temp, если есть
    const tempFilepath = path.join(tempDir, filename);
    try {
      await fs.unlink(tempFilepath);
    } catch {
      // Игнорируем, если файла нет в temp
    }

    return { success: true };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      console.warn(`Файл для удаления не найден: ${filename}`);
      return { success: true };
    }

    console.error("Ошибка удаления:", error);
    return { error: "Ошибка при удалении файла" };
  }
}
