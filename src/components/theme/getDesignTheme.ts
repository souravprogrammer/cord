const getDesignTheme = (mode: string) => ({
    palette: {
        mode,
        ...(mode === "light"
            ? {


                type: "light",
                border: {
                    main: "rgba(0,0,0,0.2)",
                },
                disable: {
                    light: "#8b8e9d",
                    main: "#74788d",
                    dark: "#636678",
                    contrastText: "#fff",
                },
                followingButton: {
                    main: "rgba(0,0,0,0.5)"
                },
                primary: {
                    main: "#000",
                },
                background: {
                    default: "rgb(243, 242, 239)",
                    dark: "#2a3042",
                    paper: "#fff",
                },
                text: {
                    head: "#000",
                    normal: "#00000099",
                    primary: "#36383b",
                    secondary: "#74788d",
                    contrasPrimary: "#ffffff",
                    contrasSecondary: "#ffffff88",
                },
            }
            : {
                // palette values for dark mode
                type: "dark",
                primary: {
                    main: "#fff",
                },
                disable: {
                    light: "#8b8e9d",
                    main: "#74788d",
                    dark: "#636678",
                    contrastText: "#fff",
                },
                followingButton: {
                    main: "rgba(255,255,255,0.5)"
                },
                icon: {
                    green: "#6fb33c",
                    warning: "#f1b44c",
                    error: "#f46a6a",
                    sidebar: "#a6b0cf",
                    sidebar1: "#ffffff",
                },
                text: {
                    head: "#fff",
                    normal: "#ffffff99",
                    primary: "#fffb",
                    secondary: "#74788d",
                    contrasPrimary: "#ffffff",
                    contrasSecondary: "#ffffff88",
                },
                shadow: {
                    navBar: "#12263f08",
                },
                border: {
                    main: "rgba(255,255,255,0.2)",
                },
                background: {
                    default: "#000",
                    paper: "#000",
                }
            }),
    },
    typography: {
        fontFamily: [
            "poppins",
        ].join(','),
    },

    selected: {},
});

export default getDesignTheme