
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  brand: z.string().min(2, { message: "Brand must be at least 2 characters." }),
  category: z.string({ required_error: "Please select a category." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional(),
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

// Categories for the clothing items
const categories = [
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Shoes",
  "Accessories",
  "Other"
];

interface AddItemFormProps {
  onAddItem: (item: {
    id: string;
    name: string;
    brand: string;
    category: string;
    image: string;
  }) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem }) => {
  // Default image placeholders
  const placeholderImages = [
    'https://placehold.co/400x400/EFECEA/4E2B25?text=Azugh+Item',
    'https://placehold.co/400x400/C3B991/292929?text=Azugh+Item',
    'https://placehold.co/400x400/4E2B25/EFECEA?text=Azugh+Item'
  ];

  // Form definition
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brand: "",
      category: "",
      imageUrl: "",
    },
  });

  // Submit handler
  const onSubmit = (data: FormValues) => {
    const randomPlaceholderIndex = Math.floor(Math.random() * placeholderImages.length);
    const newItem = {
      id: uuidv4(),
      name: data.name,
      brand: data.brand,
      category: data.category,
      image: data.imageUrl || placeholderImages[randomPlaceholderIndex],
    };
    
    onAddItem(newItem);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-azugh-text">Item Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Silk Blouse" 
                  {...field} 
                  className="bg-white/10 border-azugh-highlight/20 text-azugh-text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-azugh-text">Brand</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Zara" 
                  {...field} 
                  className="bg-white/10 border-azugh-highlight/20 text-azugh-text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-azugh-text">Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-white/10 border-azugh-highlight/20 text-azugh-text">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-azugh-bg border-azugh-highlight/20">
                  {categories.map((category) => (
                    <SelectItem 
                      key={category} 
                      value={category}
                      className="text-azugh-text hover:bg-azugh-highlight/10"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-azugh-text">Image URL (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/image.jpg" 
                  {...field} 
                  className="bg-white/10 border-azugh-highlight/20 text-azugh-text"
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-azugh-text/60">
                Leave blank to use a placeholder image
              </p>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            className="bg-azugh-accent hover:bg-azugh-accent/90 text-white"
          >
            Add to Closet
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddItemForm;
