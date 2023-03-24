import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
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
import { ListShareStatus } from "../types";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ShareListDialog {
  show?: boolean;
  onDismiss: () => void;
  sharedWith: string[];
  shareLinks: string[];
  onCreateLink: () => void;
}

export interface CreateListForm {
  name: string;
}

const makeLink = (code: string) =>
  process.env.NODE_ENV === "production"
    ? `https://listly.fcgomes.dev/share/${code}`
    : `http://localhost:3000/share/${code}`;

export default function ShareListDialog(props: ShareListDialog) {
  const { show, onDismiss, onCreateLink, shareLinks, sharedWith } = props;

  const copyToClipboardHandler = async (item: string) => {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(item);
    } else {
      document.execCommand("copy", true, item);
    }
  };

  return (
    <Dialog
      fullScreen
      open={!!show}
      onClose={onDismiss}
      TransitionComponent={Transition}
    >
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
            Compartilhar
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ margin: 2 }}>
        <Typography>Compartilhado com:</Typography>
        {sharedWith.length === 0 ? (
          <Box>
            <Typography variant="body1">
              Esta lista não está compartilhada com ninguém ainda.
            </Typography>
          </Box>
        ) : (
          <Box></Box>
        )}

        <Divider sx={{ margin: 3 }} />

        <Box sx={{ margin: 3 }}>
          {shareLinks.map((code) => (
            <Box key={code} sx={{ marginTop: 2, overflow: "scroll" }}>
              <Typography sx={{ fontSize: 14 }} variant="subtitle1">
                {makeLink(code)}
              </Typography>

              <Button
                startIcon={<ContentCopyIcon />}
                onClick={() => copyToClipboardHandler(makeLink(code))}
              >
                Copiar
              </Button>
            </Box>
          ))}
        </Box>

        {shareLinks.length === 0 ? (
          <Button variant="outlined" fullWidth onClick={onCreateLink}>
            Criar link de compartilhamento
          </Button>
        ) : null}
      </Box>
    </Dialog>
  );
}
