import { useEffect, useState } from "react";
import anecdoteService from "../services/anecdotes";

export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue("");
  };

  return { attributes: { type, value, onChange }, reset };
};

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([]);

  useEffect(() => {
    anecdoteService.getAll().then((data) => setAnecdotes(data));
  }, []);

  const addAnecdote = async (anecdote) => {
    const newAnecdote = await anecdoteService.createNew(anecdote);
    setAnecdotes(anecdotes.concat(newAnecdote));
  };

  const deleteAnecdote = async (id) => {
    await anecdoteService.deleteAnecdote(id);
    setAnecdotes(
      anecdotes.filter((anecdote) => {
        if (anecdote.id === id) {
          return;
        }

        return anecdote;
      }),
    );
  };

  return { anecdotes, addAnecdote, deleteAnecdote };
};
