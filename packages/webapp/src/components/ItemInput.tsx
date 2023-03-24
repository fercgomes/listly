import * as React from "react";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useFirestore, useFirestoreDocData } from "reactfire";
import { doc } from "firebase/firestore";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions<string[]>();

export default function ListItemInput(props: any) {
  const firestore = useFirestore();
  const userSuggestionsDoc = doc(firestore, "userSuggestions", props.userId);

  const { status, data } = useFirestoreDocData(userSuggestionsDoc);

  const suggestions: string[] = data ? data.itemSuggestions : [];
  const loading = status === "loading";

  return (
    <Autocomplete
      //   value={inputParams.}
      onChange={(event, newValue: any) => {
        if (typeof newValue === "string") {
          //   setValue({
          //     title: newValue,
          //   });
          props.onChange(event);
          props.setValue("name", newValue);
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          //   setValue({
          //     title: newValue.inputValue,
          //   });
          props.onChange(event);
          props.setValue("name", newValue);
        } else {
          //   setValue(newValue);
          props.onChange(event);
          props.setValue("name", newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue === option.title
        );
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            // @ts-ignore
            inputValue,
            title: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="name"
      loading={loading}
      options={suggestions}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option;
      }}
      renderOption={(props, option) => {
        if (typeof option === "string") {
          return <li {...props}>{option}</li>;
        }
      }}
      fullWidth
      freeSolo
      renderInput={(params) => (
        <TextField
          {...params}
          label="Adicionar novo item"
          placeholder="Nome do item"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
