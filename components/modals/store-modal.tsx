"use client"
import * as z from 'zod'
import { useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { zodResolver } from '@hookform/resolvers/zod'

import { useStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "@/components/ui/modal"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'


const formSchema = z.object({
  name: z.string().min(1, 'name is required'),
});

export const StoreModal = () => {
  const StoreModal = useStoreModal()

  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const response = await axios.post('/api/stores', values)

      window.location.assign(`/${response.data.id}`)
      
    } catch (error) {
      console.log(error);
      toast.error('Error creating store')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Create Store"
      description="add a new store"
      isOpen={StoreModal.isOpen}
      onClose={StoreModal.onClose}
    >
      <div>
        <div className="space-y-4 py-4 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E-Commerce" {...field} disabled={loading}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='pt-6 space-x-2 flex items-center justify-end'>
                <Button
                  variant='outline'
                  onClick={StoreModal.onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={loading}
                >
                  Continue
                </Button>
              </div>
            </form>
          </Form>

        </div>
      </div>
    </Modal>
  )
}