import React from "react";

export const HomeKeyFeatures = () => {
  const features = [
    {
      icon: "✏️",
      title: "Intuitive Builder",
      description:
        "Easily customize your character with our step-by-step builder. Choose from a wide selection of races, classes, abilities, and more.",
    },
    {
      icon: "🎲",
      title: "Dice Roller",
      description:
        "Roll dice directly within the app for ability scores, attacks, and saving throws. Keep track of your rolls and results in one place.",
    },
    {
      icon: "👥",
      title: "Community",
      description:
        "Share your unique character creations with the community and discover characters created by other players. Collaborate and inspire.",
    },
    {
      icon: "📊",
      title: "Digital Sheet",
      description:
        "Manage your character sheets digitally, with automatic calculations and easy access to all your character's stats, abilities, and equipment.",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Key Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the powerful tools that make Character Forge the ultimate
            D&D character creation experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
