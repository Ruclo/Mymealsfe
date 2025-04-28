import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App'
import { ErrorPage } from './features/ErrorPage'
import { HomePage } from './features/home/HomePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      /*{
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'order',
        element: <OrderContextProvider />,
        children: [
          {
            index: true,
            element: <CreateOrderPage />
          },
          {
            path: 'meals',
            children: [
              {
                index: true,
                element: <MealMenuPage />
              },
              {
                path: ':mealID',
                element: <MealDetailPage />
              },
            ]
          },
          {
            path: ":orderID",
            children: [
              {
                index: true,
                element: <OrderFinishedPage />
              },
              {
                path: 'review',
                element: <PostReviewPage />
              },
              {
                path: 'order-more',
                children: [
                  {
                    index: true,
                    element: <OrderMoreMealsPage />
                  },
                  {
                    path: 'meals',
                    children: [
                      {
                        index: true,
                        element: <MealMenuPage />
                      },
                      {
                        path: ':mealID',
                        element: <MealDetailPage />
                      }
                    ]
                  }
                
                ]
              }

            ]
          }
        ]
      },
      {
        path: 'admin',
        children: [
          {
            index: true,
            element: <AdminPage />
          },
          {
            path: 'employees',
            children: [
              {
                index: true,
                element: <ManageEmployeesPage />
              },
              {
                path: 'create',
                element: <CreateEmployeePage />
              }
            ]
          },
          { //TODO: Edit meal, create meal
            path: 'meals',
            children: [
              {
                index: true,
                element: <ManageMealsPage />
              },
              {
                path: 'create',
                element: <CreateMealPage />
              },
              {
                path: ':mealID/edit',
                element: <EditMealPage />
              }
            ]
            
          },
          {
            path: 'orders',
            children: [
              {
                index: true,
                element: <OrdersPage />
              },
              {
                path: "pending",
                element: <PendingOrdersPage />
              }
            ]
          },
          {
            path: "change-password",
            element: <ChangePasswordPage />
          }
        ]
      },
      {
        path: 'staff',
        children: [
          {
            index: true,
            element: <StaffPage />
          },
          {
            path: "orders/pending",
            element: <PendingOrdersPage />
          },
          {
            path: "change-password",
            element: <ChangePasswordPage />
          }
        ]
      }*/
    ]

  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
