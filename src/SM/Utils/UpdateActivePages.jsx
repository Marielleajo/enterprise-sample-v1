import { useDispatch, useSelector } from "react-redux";
import { SideNav } from "../../Redux/New/Redux/Reducers/SideNavData";

export const useUpdateActivePages = () => {
  // We are capture here all levels matching the given route and identify active menus from levels 0 to 2
  const pages = useSelector((state) => state?.menus);
  const dispatch = useDispatch();

  const updatePages = (route) => {
    if (!route || !pages) return null;

    const updatedRoute = route.replace(/^\//, "");

    const sortedMenus = [...pages]?.sort(
      (a, b) => (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0)
    );

    let result = [];

    const matchingItems = sortedMenus.filter(
      (item) => item?.uri === updatedRoute
    );

    const sortedMatchingItems = matchingItems.sort((a, b) => {
      const getLevel = (item) => {
        if (item?.parentGuid === null) return 0;
        if (sortedMenus.some((menu) => menu?.parentGuid === item?.recordGuid))
          return 1;
        return 2;
      };

      return getLevel(a) - getLevel(b);
    });

    if (!matchingItems?.length) return null;

    const subChildItem = sortedMatchingItems[matchingItems.length - 1];

    if (subChildItem) {
      result.unshift(subChildItem.recordGuid);
    }

    const childItem = subChildItem
      ? sortedMenus.find((item) => item?.recordGuid === subChildItem.parentGuid)
      : null;

    if (childItem) {
      result.unshift(childItem.recordGuid);
    }

    const parentItem = childItem
      ? sortedMenus.find((item) => item?.recordGuid === childItem.parentGuid)
      : null;

    if (parentItem) {
      result.unshift(parentItem.recordGuid);
    }

    let redirectUri =
      subChildItem?.uri || childItem?.uri || parentItem?.uri || "/";
    dispatch(
      SideNav({
        selectedTab: `/${redirectUri}`,
        allSelectedTabs: result,
      })
    );
  };

  return updatePages;
};
