import { useState } from "react";

import { toast } from "react-toastify";

import { useNickname } from "../../../context";

export function useEditNickname() {
  const [nickname, setNickname] = useNickname();
  const [isEditingNick, setIsEditingNick] = useState(nickname === "");
  const [editableNickname, setEditableNickname] = useState(nickname);

  const handleSaveNickname = () => {
    if (editableNickname.length < 2) {
      toast.error("Nickname must be at least 2 characters long");
      return;
    }

    setNickname(editableNickname);
    setIsEditingNick(false);
  };

  const onNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = event.target.value;
    if (newNickname.length > 12) return;
    setEditableNickname(newNickname);
  };

  const saveOrEditNickname = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEditingNick) {
      handleSaveNickname();
    } else {
      setIsEditingNick(true);
    }
  };

  const hasValidNickname = nickname.length >= 2;

  return {
    nickname,
    isEditingNick,
    editableNickname,
    onNicknameChange,
    saveOrEditNickname,
    hasValidNickname,
  };
}
