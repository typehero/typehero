'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { RadioGroup, RadioGroupItem } from '@repo/ui/components/radio-group';
import { useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { z } from 'zod';
import { createCheckoutSession } from '../_actions/stripe';

const AMOUNTS = ['5', '10', '25'];

export default function CheckoutForm() {
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const FormSchema = z.object({
    amount: z.string().refine(
      (val) => {
        const number = parseFloat(val);

        if (val === 'custom') {
          return true;
        }

        return !isNaN(number) && number > 0;
      },
      {
        message: 'Amount must be a positive number',
      },
    ),
    customAmount: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: '5',
      customAmount: '5',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const amount = parseFloat(data.amount);
    const { url } = await createCheckoutSession(amount);
    window.location.assign(url!);
  }

  const watchAmount = form.watch('amount');

  // kill me
  useEffect(() => {
    if (!isCustomAmount) {
      return;
    }
    form.setValue('amount', form.getValues('customAmount'));
  }, [isCustomAmount, form]);

  return (
    <Card className="h-auto w-full border bg-transparent bg-gradient-to-br from-neutral-50 to-neutral-100 transition hover:border-transparent dark:from-neutral-900/95 dark:to-neutral-950/95">
      <CardHeader>
        <CardTitle>Select an amount</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form className="z-10 flex flex-col space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {Boolean(isCustomAmount) && (
              <FormField
                control={form.control}
                name="customAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom</FormLabel>
                    <FormControl>
                      <NumericFormat
                        {...field}
                        allowNegative={false}
                        defaultValue={field.value}
                        customInput={Input}
                        thousandSeparator=","
                        decimalScale={2}
                        fixedDecimalScale
                        prefix="$"
                        onValueChange={(values) => {
                          field.onChange(values.value);
                          form.setValue('amount', values.value);
                        }}
                        id="customAmount"
                        placeholder="Enter amount"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      setIsCustomAmount(value === 'custom');
                    }}
                    defaultValue={field.value}
                    className="flex flex-wrap gap-2"
                  >
                    {AMOUNTS.map((amount) => (
                      <div key={amount}>
                        <RadioGroupItem
                          value={amount}
                          id={`amount-${amount}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`amount-${amount}`}
                          className="peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground flex cursor-pointer items-center justify-center rounded-md border px-4 py-2 text-sm"
                        >
                          ${amount}
                        </Label>
                      </div>
                    ))}
                    <div>
                      <RadioGroupItem value="custom" id="amount-custom" className="peer sr-only" />
                      <Label
                        htmlFor="amount-custom"
                        className="peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground flex cursor-pointer items-center justify-center rounded-md border px-4 py-2 text-sm"
                      >
                        Custom
                      </Label>
                    </div>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              variant="secondary"
              className="border border-slate-400 dark:border-slate-800"
            >
              Donate{' '}
              {Number.isNaN(parseFloat(watchAmount))
                ? `a valid amount!`
                : `$${parseFloat(watchAmount).toFixed(2)}`}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
