export const buildMenuHierarchy = (menuItems) => {
    const menuMap = {};
    const orphanItems = [];
    let sortedData = [...menuItems].sort(
        (a, b) => a?.displayOrder - b?.displayOrder
    );

    if (sortedData.length > 1) {
        sortedData = sortedData.filter((page) => page.parentGuid !== null);
    }

    sortedData.forEach((page) => {
        menuMap[page.recordGuid] = {...page, children: []};
    });

    const rootMenus = [];
    sortedData.forEach((page) => {
        if (page.parentGuid) {
            if (menuMap[page.parentGuid]) {
                menuMap[page.parentGuid].children.push(menuMap[page.recordGuid]);
            } else {
                orphanItems.push(menuMap[page.recordGuid]);
            }
        } else {
            rootMenus.push(menuMap[page.recordGuid]);
        }
    });

    return [...rootMenus, ...orphanItems];
};

export const openedMixin = (theme) => ({
    width: 230,
    transition: theme.transitions.create("width", {
        easing: "ease-in-out",
        duration: theme.transitions.duration.enteringScreen * 2,
    }),
    overflowX: "hidden",
});

export const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: "ease-in-out",
        duration: theme.transitions.duration.leavingScreen * 2,
    }),
    overflowX: "hidden",
    width: (theme) => `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: (theme) => `calc(${theme.spacing(11)} + 1px)`,
    },
});


export const openedMixinMobile = (theme) => ({
    width: "100%",
    transition: theme.transitions.create("width", {
        easing: "ease-in-out",
        duration: theme.transitions.duration.enteringScreen * 2,
    }),
    overflowX: "hidden",
});

export const closedMixinMobile = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: "ease-in-out",
        duration: theme.transitions.duration.leavingScreen * 2,
    }),
    overflowX: "hidden",
    overflowY: "hidden",
    height: "55px",
    width: (theme) => `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: (theme) => `calc(${theme.spacing(11)} + 1px)`,
    },
});