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
import { mealByIdLoader, mealsLoader } from './api/meals'
import { MealMenuPage } from './pages/meals/MealMenuPage'
import { MealDetailPage } from './pages/meals/MealDetailPage'
import { OrderContextRoute } from './context/OrderContext'
import { CreateOrderPage } from './pages/orders/CreateOrderPage'
import { OrderFinishedPage } from './pages/orders/OrderFinishedPage'
import { PostReviewPage } from './pages/orders/PostReviewPage'
import { OrderMoreMealsPage } from './pages/orders/OrderMoreMealsPage'
import { staffLoader } from './api/users'
import { ManageEmployeesPage } from './pages/employees/ManageEmployeesPage'
import { CreateEmployeePage } from './pages/employees/CreateEmployeePage'
import { ManageMealsPage } from './pages/meals/ManageMealsPage'
import { CreateMealPage } from './pages/meals/CreateMealPage'
import { EditMealPage } from './pages/meals/EditMealPage'
import { OrdersPage } from './pages/orders/OrdersPage'
import { ordersLoader } from './api/orders'
import { PendingOrdersPage } from './pages/orders/PendingOrdersPage'

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
            element: <CreateOrderPage />,
            loader: mealsLoader(queryClient)
          },
          {
            path: 'meals',
            children: [
              {
                index: true,
                element: <MealMenuPage />,
                loader: mealsLoader(queryClient)
              },
              {
                path: ':mealID',
                element: <MealDetailPage />,
                loader: mealByIdLoader(queryClient)
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
                    element: <OrderMoreMealsPage />,
                    loader: mealsLoader(queryClient)
                  },
                  {
                    path: 'meals',
                    children: [
                      {
                        index: true,
                        element: <MealMenuPage />,
                        loader: mealsLoader(queryClient)
                      },
                      {
                        path: ':mealID',
                        element: <MealDetailPage />,
                        loader: mealByIdLoader(queryClient)
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
            path: "change-password",
            element: <ChangePasswordPage />
          },
          {
            path: 'employees',
            children: [
              {
                index: true,
                element: <ManageEmployeesPage />,
                loader: staffLoader(queryClient)
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
                element: <ManageMealsPage />,
                loader: mealsLoader(queryClient)
              },
              {
                path: 'create',
                element: <CreateMealPage />
              },
              
              {
                path: ':mealID/edit',
                element: <EditMealPage />,
                loader: mealByIdLoader(queryClient)
              }
            ]
            
          },
          {
            path: 'orders',
            children: [
              {
                index: true,
                element: <OrdersPage />,
                loader: ordersLoader(queryClient)
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
