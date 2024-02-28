import Discover from 'pages/Discover';
import HistoryPage from 'pages/HistoryPage';
import Home from 'pages/Home';
import NotFound from 'pages/NotFound';
import Order from 'pages/Cart';
import Setting from 'pages/Setting';
import AppereanceSetting from 'pages/Setting/components/AppearanceSetting';
import ProfileSetting from 'pages/Setting/components/ProfileSetting';
import SecuritySetting from 'pages/Setting/components/SecuritySetting';
import { createBrowserRouter } from 'react-router-dom';
const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <NotFound />,
        children: [],
    },
    {
        path: "/discover",
        element: <Discover />,
        errorElement: <NotFound />,
        children: [],
    },
    {
        path: "/order",
        element: <Order />,
        errorElement: <NotFound />,
        children: [],
    },
    {
        path: "/history",
        element: <HistoryPage />,
        errorElement: <NotFound />,
        children: [],
    },
    {
        path: "/setting",
        element: <Setting />,
        errorElement: <NotFound />,
        children: [
            {
                path: "/appereance",
                element: <AppereanceSetting />,
            },
            {
                path: "/profile",
                element: <ProfileSetting />,
            },
            {
                path: "/security",
                element: <SecuritySetting />,
            },
        ],
    }
]);
export default router;