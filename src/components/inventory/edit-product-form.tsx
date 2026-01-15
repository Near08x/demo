
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Product } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  price: z.coerce.number().positive({
    message: 'Price must be a positive number.',
  }),
  price2: z.coerce.number().positive({
    message: 'Price 2 must be a positive number.',
  }),
  price3: z.coerce.number().positive({
    message: 'Price 3 must be a positive number.',
  }),
  cost: z.coerce.number().positive({
    message: 'Cost must be a positive number.',
  }),
  provider: z.string().min(2, {
    message: 'Provider must be at least 2 characters.',
  }),
  stock: z.coerce.number().int().min(0, {
    message: 'Stock must be a non-negative integer.',
  }),
});

type EditProductFormProps = {
  product: Product;
  onUpdateProduct: (product: Product) => void;
};

export default function EditProductForm({ product, onUpdateProduct }: EditProductFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      price2: product.price2,
      price3: product.price3,
      cost: product.cost,
      provider: product.provider,
      stock: product.stock,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onUpdateProduct({ ...product, ...values });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Galaxy S25 Ultra" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the product..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price 1 (Retail)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1399.99" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price 2 (Wholesale)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1350.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price 3 (Sale)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1300.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="999.99" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provider</FormLabel>
                <FormControl>
                  <Input placeholder="Samsung" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="25" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">Update Product</Button>
      </form>
    </Form>
  );
}
