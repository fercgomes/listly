import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useForm } from "react-hook-form";
import { Box } from "@mui/system";
import TextField from "@mui/material/TextField";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface NewListDialogProps {
  show?: boolean;
  onDismiss: () => void;
  onCreate: (list: any) => void;
}

export interface CreateListForm {
  name: string;
}

export default function NewListDialog(props: NewListDialogProps) {
  const { show, onDismiss, onCreate } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateListForm>();

  const createHandler = (data: CreateListForm) => {
    reset();
    onCreate(data);
  };

  return (
    <Dialog
      fullScreen
      open={!!show}
      onClose={onDismiss}
      TransitionComponent={Transition}
    >
      <form onSubmit={handleSubmit(createHandler)}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onDismiss}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Nova Lista
            </Typography>
            <Button autoFocus color="inherit" type="submit">
              salvar
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ margin: 2 }}>
          <TextField
            {...register("name")}
            autoFocus
            placeholder="Nome da lista"
            label="Nome"
            fullWidth
            helperText={errors.name?.message}
          />
        </Box>
      </form>

      {/* <List>
        <ListItem button>
          <ListItemText primary="Phone ringtone" secondary="Titania" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemText
            primary="Default notification ringtone"
            secondary="Tethys"
          />
        </ListItem>
      </List> */}
    </Dialog>
  );
}
