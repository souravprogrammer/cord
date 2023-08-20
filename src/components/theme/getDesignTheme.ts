const getDesignTheme = (mode: string) => ({
    palette: {
        mode,
        ...(mode === "light"
            ? {
                type: "light",
                // palette values for light mode
                // primary: {
                //   light: "#93a5ff",
                //   main: "#556ee6",
                //   dark: "#485ec4",
                // },
                // secondary: {
                //   light: "#ffa726",
                //   main: "#EA6823",
                //   dark: "#fb8c00",
                // },
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
                // primary: {
                //     main: "#ff7043",
                // },
                // secondary: {
                //     main: "#c2185b",
                // },
                // button: {
                //     main: "#1976d2",
                // },
                // contras: {
                //     main: "#000000",
                // },
                // current: {
                //     main: "#ffffff",
                // },
                // disable: {
                //     light: "#8b8e9d",
                //     main: "#74788d",
                //     dark: "#636678",
                //     contrastText: "#fff",
                // },
                background: {
                    default: "rgb(243, 242, 239)",
                    dark: "#2a3042",
                    paper: "#fff",
                },
                // icon: {
                //     green: "#6fb33c",
                //     warning: "#f1b44c",
                //     error: "#f46a6a",
                //     sidebar: "#a6b0cf",
                //     sidebar1: "#ffffff",
                // },
                text: {
                    head: "#000",
                    normal: "#00000099",
                    primary: "#36383b",
                    secondary: "#74788d",
                    contrasPrimary: "#ffffff",
                    contrasSecondary: "#ffffff88",
                },
                // border: {
                //     main: "#eff2f7",
                //     primary: "#495057",
                //     scroll: " #666e7c",
                // },
                // shadow: {
                //     navBar: "#12263f08",
                // },
                // attendance: {
                //     present: "#3CCF4E",
                //     leave: "#EF5B0C",
                //     absent: "#C21010",
                //     sports: "#277BC0",
                //     medical: "#1CD6CE",
                //     half: "#F6A192",
                //     chip: "#00000014",
                // },
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
                // border: {
                //     main: "#eff2f7",
                //     primary: "#495057",
                //     scroll: " #666e7c",
                // },
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

                // background: {
                //     default: "#111111",
                //     // "#222736",
                // },


            }),
    },
    typography: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
    },
    selected: {},
});

export default getDesignTheme