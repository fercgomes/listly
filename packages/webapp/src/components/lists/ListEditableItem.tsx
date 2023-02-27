import { Box } from "native-base";
import { List } from "../../types";

interface ListEditableItemProps {
  list: List;
  onChangeName: (newName: string) => void;
  editable: boolean;
}

const ListEditableItem: React.FC<ListEditableItemProps> = (props) => {
  const { list, onChangeName, editable } = props;

  return <Box>

  </Box>;
};

export default ListEditableItem;
