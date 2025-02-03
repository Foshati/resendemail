'use client';
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { sendContactEmail } from '@/lib/email-contact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Mail, User, AlertCircle } from 'lucide-react';
import { contactFormSchema } from '@/schemas/contactFormSchema';
import { Spinner } from '@/components/ui/spinner';

type ContactFormSchema = z.infer<typeof contactFormSchema>;

export default function SupportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormSchema) => {
    try {
      setIsLoading(true);
      setSubmitStatus('idle');
      const response = await sendContactEmail(data);
      if (response.success) {
        setSubmitStatus('success');
        toast.success('Message sent successfully!', {
          duration: 3000,
        });
        reset();
      } else {
        setSubmitStatus('error');
        toast.error(response.error || 'Failed to send message');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSubmitStatus('error');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='m-5'>
      <Card className='w-full max-w-4xl  bg-black/95 text-white shadow-2xl border-zinc-800 mt-4 mx-auto'>
        <CardHeader className='space-y-4'>
          <CardTitle className='text-3xl font-bold text-center'>Email Support</CardTitle>
          <CardDescription className='text-center text-zinc-400'>
            Please fill out the form below. Our support team will get back to you as soon as possible.
          </CardDescription>
        </CardHeader>

        <CardContent className='p-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='space-y-3'>
                <Label htmlFor='firstName' className='text-sm font-medium flex items-center gap-2'>
                  <User className='w-4 h-4' />
                  First Name
                </Label>
                <Input
                  id='firstName'
                  type='text'
                  className='bg-black/50 border-zinc-700 focus:border-white transition-colors'
                  {...register('firstName')}
                  disabled={isLoading}
                  placeholder='Enter your first name'
                />
                {errors.firstName && (
                  <span className='text-red-400 text-sm flex items-center gap-2'>
                    <AlertCircle className='w-4 h-4' />
                    {errors.firstName.message}
                  </span>
                )}
              </div>

              <div className='space-y-3'>
                <Label htmlFor='lastName' className='text-sm font-medium flex items-center gap-2'>
                  Last Name
                </Label>
                <Input
                  id='lastName'
                  type='text'
                  className='bg-black/50 border-zinc-700 focus:border-white transition-colors'
                  {...register('lastName')}
                  disabled={isLoading}
                  placeholder='Enter your last name'
                />
                {errors.lastName && (
                  <span className='text-red-400 text-sm flex items-center gap-2'>
                    <AlertCircle className='w-4 h-4' />
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </div>

            <div className='space-y-3'>
              <Label htmlFor='email' className='text-sm font-medium flex items-center gap-2'>
                <Mail className='w-4 h-4' />
                Email Address
              </Label>
              <Input
                id='email'
                type='email'
                className='bg-black/50 border-zinc-700 focus:border-white transition-colors'
                {...register('email')}
                disabled={isLoading}
                placeholder='example@domain.com'
              />
              {errors.email && (
                <span className='text-red-400 text-sm flex items-center gap-2'>
                  <AlertCircle className='w-4 h-4' />
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className='space-y-3'>
              <Label htmlFor='message' className='text-sm font-medium flex items-center gap-2'>
                <MessageSquare className='w-4 h-4' />
                Message
              </Label>
              <Textarea
                id='message'
                className='min-h-[150px] bg-black/50 border-zinc-700 focus:border-white transition-colors'
                placeholder='Write your message here...'
                {...register('message')}
                disabled={isLoading}
              />
              {errors.message && (
                <span className='text-red-400 text-sm flex items-center gap-2'>
                  <AlertCircle className='w-4 h-4' />
                  {errors.message.message}
                </span>
              )}
            </div>

            {submitStatus === 'error' && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>An error occurred while sending your message. Please try again.</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>

        <CardFooter className='flex justify-center p-6 pt-2'>
          <Button onClick={handleSubmit(onSubmit)} size='lg' className='w-full md:w-1/2  ' disabled={isLoading}>
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <Spinner size='md' variant='sparkle' />
              </div>
            ) : (
              'Send Message'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
