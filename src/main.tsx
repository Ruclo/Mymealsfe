import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App'
import { ErrorPage } from './pages/ErrorPage'
import { HomePage } from './pages/home/HomePage'
import { LoginPage } from './pages/auth/LoginPage'
import { AdminPage } from './pages/home/AdminPage'
import { StaffPage } from './pages/home/StaffPage'
import { ChangePasswordPage } from './pages/auth/ChangePasswordPage'
import { MealMenuPage } from './pages/meals/MealMenuPage'
import { MealDetailPage } from './pages/meals/MealDetailPage'
import { OrderContextRoute } from './context/OrderContext'
import { CreateOrderPage } from './pages/orders/CreateOrderPage'
import { OrderFinishedPage } from './pages/orders/OrderFinishedPage'
import { PostReviewPage } from './pages/orders/PostReviewPage'
import { OrderMoreMealsPage } from './pages/orders/OrderMoreMealsPage'
import { ManageEmployeesPage } from './pages/employees/ManageEmployeesPage'
import { CreateEmployeePage } from './pages/employees/CreateEmployeePage'
import { ManageMealsPage } from './pages/meals/ManageMealsPage'
import { CreateMealPage } from './pages/meals/CreateMealPage'
import { EditMealPage } from './pages/meals/EditMealPage'
import { OrdersPage } from './pages/orders/OrdersPage'
import { PendingOrdersPage } from './pages/orders/PendingOrdersPage'
import { RequireRole } from './routes/RequireRole'
import { UserRole } from './types/user'

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
      {
        path: 'login',
        element: <LoginPage />
      },
      
      {
        path: 'order',
        element: <OrderContextRoute />,
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
        element: <RequireRole roles={[UserRole.Admin]} />,
        children: [
          {
            index: true,
            element: <AdminPage />
          },
          {
            path: "change-password",
            element: <ChangePasswordPage />
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
        ]
      },
      
      {
        path: 'staff',
        element: <RequireRole roles={[UserRole.Admin, UserRole.RegularStaff]} />,
        children: [
          {
            index: true,
            element: <StaffPage />
          },
          {
            path: "change-password",
            element: <ChangePasswordPage />
          },
          {
            path: "orders/pending",
            element: <PendingOrdersPage />
          },
          
        ]
    }
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
