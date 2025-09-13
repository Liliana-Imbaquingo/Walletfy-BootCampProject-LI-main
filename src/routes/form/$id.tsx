import React, { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { useStore } from '@tanstack/react-form'
import type { CreateEventType } from '@/types/event'
import { CreateEventSchema } from '@/types/event'
import DataRepo from '@/api/datasource'
import { useAppForm } from '@/hooks/form'
import { notifications } from '@/lib/notification'

export const Route = createFileRoute('/form/$id')({
  component: RouteComponent,
})

const defaultValues: CreateEventType = {
  name: '',
  description: '',
  amount: 5,
  date: '',
  type: 'Expense',
}

function RouteComponent() {
  // Get the `id` parameter from the route
  const { id } = Route.useParams()
  const navigate = useNavigate()

  const [mode] = React.useState<'create' | 'update'>(
    id === 'new' ? 'create' : 'update',
  )

  const { data } = useQuery({
    enabled: mode === 'update',
    queryKey: ['event', id],
    queryFn: () => DataRepo.getEventById(id),
  })
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    boolean,
    Error,
    CreateEventType
  >({
    mutationKey: ['event'],
    mutationFn: async (values) => {
      if (mode === 'create') {
        await DataRepo.saveEvent(values)
      } else {
        await DataRepo.updateEvent({
          ...values,
          id: id,
        })
      }
      queryClient.invalidateQueries({
        queryKey: ["eventsMonth"]
      })
      return true
    },
    onSettled: (_, error) => {
      if (error) {
        notifications.error({
          title: 'Error',
          message:
            error.message || 'An error occurred while saving the event',
        })
      } else {
        if (mode === 'create') {
          notifications.success({
            title: 'Success',
            message: 'Event created successfully!',
          })
        }
        if (mode === 'update') {
          notifications.success({
            title: 'Success',
            message: 'Event updated successfully!',
          })
        }
        // Redirect to the candidates list or another page
        navigate({ to: '/flow-balance' })
      }
    },
  })

  const form = useAppForm({
    defaultValues,
    onSubmit: ({ value }) => {
      mutate(value)
    },
    onSubmitInvalid: (errors) => {
      console.error('Form submission errors:', errors)
    },
    validators: {
      onSubmit: CreateEventSchema,
    },
  })

  useEffect(() => {
    if (data) {
      // setForm({
      //   name: data.name,
      //   age: data.age,
      //   experience: data.experience,
      //   status: data.status,
      //   skills: data.skills,
      //   working: data.working,
      // })
      form.reset(
        {
          name: data.name,
          description: data.description,
          amount: data.amount,
          date: data.date,
          type: data.type,
        },
        { keepDefaultValues: true },
      )
    }
  }, [data])

  return (
    <div className="flex flex-row gap-x-4 ">
      <form
        className="flex flex-col gap-4 p-4 min-w-[450px] dark:text-zinc-200"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <h1 className="text-2xl font-bold">Form</h1>

        <form.AppField
          name="name"
          children={(field) => (
            <field.Input
              type="text"
              label="Name"
              placeholder="Enter the name of the event"
              className="w-full "
            />
          )}
        />

        <form.AppField
          name="description"
          children={(field) => (
            <field.Input
              type="text"
              label="Description"
              placeholder="Enter the description of the event"
              className="w-full"
            />
          )}
        />

        <form.AppField
          name="amount"
          children={(field) => (
            <field.Input
              type="number"
              label="Amount ($)"
              placeholder="Enter the amount($)"
              className="w-full"
              value={field.state.value}
              error={field.state.meta.errors.map((e) => e?.message).join(', ')}
              onChange={(e) => field.setValue(Number(e.target.value))}
            />
          )}
        />

        <form.AppField
          name="type"
          children={(field) => (
            <field.Select
              label="Type"
              className="w-full"
              options={[
                { value: 'Income', label: 'Income' },
                { value: 'Expense', label: 'Expense' },

              ]}
            />
          )}
        />

        <form.AppField
          name="date"
          children={(field) => (
            <field.Input
              type="date"
              label="Date"
              className="w-full  dateFormat='DD/MM/YYYY'"
            />
          )}
        />

        <form.AppForm>
          <form.SubmitButton
            text={
              isPending
                ? 'Saving..'
                : (mode === 'create' ? 'Create' : 'Update') + ' Event'
            }
            type="submit"
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          />
        </form.AppForm>
      </form>
    </div>
  )
}
