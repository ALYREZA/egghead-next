// Source: https://xstate-catalogue.com/machines/confirmation-dialog
import {assign, createMachine} from 'xstate'

type Member = {
  id: number
  name: string
  email: string
}

export interface ConfirmationDialogMachineContext {
  action?: () => Promise<void>
  errorMessage?: string
  memberToRemove: Member | undefined
}

type ConfirmationDialogMachineEvent =
  | {
      type: 'OPEN_DIALOG'
      action: () => Promise<void>
    }
  | {
      type: 'CONFIRM'
    }
  | {
      type: 'CANCEL'
    }

const removeTeamMember = (userId: number) => {
  if (teamData?.accountId) {
    const removeTeamMemberUrl = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/accounts/${teamData.accountId}/team_members/${userId}`

    return axios
      .delete(removeTeamMemberUrl, {
        headers: {...getAuthorizationHeader()},
      })
      .then((response: Object) => {
        console.log({response, userId})
        setMembers((prevMembers) => {
          return prevMembers.filter(({id}: {id: number}) => id !== userId)
        })
      })
  }
}

const confirmationDialogMachine = createMachine<
  ConfirmationDialogMachineContext,
  ConfirmationDialogMachineEvent
>(
  {
    id: 'confirmationDialog',
    initial: 'closed',
    context: {memberToRemove: undefined},
    states: {
      closed: {
        id: 'closed',
        on: {
          OPEN_DIALOG: {
            target: 'open',
            actions: 'assignActionToContext',
          },
        },
      },
      open: {
        exit: ['clearErrorMessage'],
        initial: 'idle',
        states: {
          idle: {
            on: {
              CANCEL: {
                target: '#closed',
                actions: [assign({memberToRemove: undefined})],
              },
              CONFIRM: 'executingAction',
            },
          },
          executingAction: {
            invoke: {
              src: 'executeAction',
              onError: {
                target: 'idle',
                actions: 'assignErrorMessageToContext',
              },
              onDone: {
                target: '#closed',
                actions: ['clearActionFromContext', 'onSuccess'],
              },
            },
          },
        },
      },
    },
  },
  {
    services: {
      executeAction: (context) => () => {
        const {memberToRemove} = context

        console.log('Member To Remove: ', memberToRemove)
        removeTeamMember(memberToRemove.id)
        // For demonstration purposes, I've commented this out.
        // await context.action()
      },
    },
    actions: {
      assignActionToContext: assign((context, event) => {
        console.log('Event: ', event)
        if (event.type !== 'OPEN_DIALOG') return {}
        return {
          action: event.action,
          memberToRemove: event.payload.member,
        }
      }),
      assignErrorMessageToContext: assign((context, event: any) => {
        return {
          errorMessage: event.data?.message || 'An unknown error occurred',
        }
      }),
      clearErrorMessage: assign({
        errorMessage: undefined,
      }),
      clearActionFromContext: assign({
        action: undefined,
      }),
      onSuccess: () => {
        alert('onSuccess fired!')
      },
    },
  },
)

export default confirmationDialogMachine
