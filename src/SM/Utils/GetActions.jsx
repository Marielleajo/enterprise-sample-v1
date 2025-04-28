import {useSelector} from "react-redux";

import ForbbidenComponent from "../../Components/_403";

const GetActions = (Component) => {
    const AuthenticatedComponent = (props) => {
        let {menus} = useSelector((state) => state);

        let pathname = window?.location?.pathname?.replace(/^\/+/, "");
        let actions = [];

        const sortedMenus = [...menus]?.sort(
            (a, b) => (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0)
        );

        const matchingItems = sortedMenus?.filter((item) => item?.uri === pathname);

        const sortedMatchingItems = matchingItems?.sort((a, b) => {
            const getLevel = (item) => {
                if (item?.parentGuid === null) return 0;
                if (sortedMenus.some((menu) => menu?.parentGuid === item?.recordGuid))
                    return 1;
                return 2;
            };

            return getLevel(a) - getLevel(b);
        });

        const menuItem = sortedMatchingItems[matchingItems.length - 1];

        const accessibleActions = menuItem?.menuAction?.filter(
            (item) => item.hasAccess === true
        );
        actions = accessibleActions?.map((item) => item?.menuActionDetail[0]?.name);
        // actions = ["View", "Add", "Edit", "Delete", "Export"];

        if (actions?.length > 0 && actions?.includes("View")) {
            return <Component {...props} actions={actions}/>;
        } else {
            return <ForbbidenComponent/>;
        }
    };

    return AuthenticatedComponent;
};

export default GetActions;
