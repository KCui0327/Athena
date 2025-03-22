
import React from "react";
import { cn } from "@/lib/utils";
import Section, { SectionTitle } from "@/components/ui-custom/Section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { motion } from "framer-motion";

interface TestimonialsProps {
  className?: string;
}

const Testimonials = ({ className }: TestimonialsProps) => {
  const testimonials = [
    {
      name: "Alex Johnson",
      avatar: "/images/avatar-1.jpg",
      role: "Medical Student",
      testimonial: "Athena transformed how I study for med school. The AI-generated quizzes helped me identify weak areas in my knowledge that I never would have caught otherwise.",
      rating: 5,
    },
    {
      name: "Sarah Chen",
      avatar: "/images/avatar-2.jpg",
      role: "Engineering Student",
      testimonial: "The video snippets feature is amazing! Complex engineering concepts are broken down into bite-sized explanations that actually make sense.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      avatar: "/images/avatar-3.jpg",
      role: "Law Student",
      testimonial: "The study guides Athena creates from my chaotic notes are incredible. It organizes everything logically and helps me prepare for exams in half the time.",
      rating: 4,
    },
  ];

  return (
    <Section className={cn("bg-white", className)}>
      <SectionTitle 
        title="What Our Users Say"
        subtitle="Join thousands of students who are transforming how they learn"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full border-border/50 bg-card/90 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <StarIcon
                      key={i}
                      size={16}
                      className={i < testimonial.rating ? "text-amber-500 fill-amber-500" : "text-muted"}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.testimonial}"</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default Testimonials;
