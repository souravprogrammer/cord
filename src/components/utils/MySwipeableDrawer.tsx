import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  PropsWithChildren,
  useEffect,
} from "react";
import { SwipeableDrawer, Box } from "@mui/material";

function MySwipableDrawer({ children }: PropsWithChildren, ref: any) {
  const cont = useRef<any>();

  const [open, setOpen] = useState<boolean>();

  useEffect(() => {
    setOpen(false);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      setOpen,
    }),
    [open, setOpen]
  );
  return (
    <Box ref={cont}>
      {open === undefined ? null : (
        <SwipeableDrawer
          container={cont.current as any}
          anchor="bottom"
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          onOpen={() => {}}
          swipeAreaWidth={0}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: false,
          }}
        >
          {/* {children} */}
          {React.Children.map(children, (child: any) => {
            return React.cloneElement(child, { setOpen });
          })}
        </SwipeableDrawer>
      )}
    </Box>
  );
}

export default forwardRef(MySwipableDrawer);
