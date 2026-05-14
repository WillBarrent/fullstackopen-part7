import { useNavigate } from "react-router-dom";
import { useAnecdotes, useField } from "../hooks";

const CreateNew = () => {
  const content = useField("text");
  const author = useField("text");
  const info = useField("text");
  const navigate = useNavigate();

  const { addAnecdote } = useAnecdotes();

  const handleSubmit = (e) => {
    e.preventDefault();
    addAnecdote({
      content: content.attributes.value,
      author: author.attributes.value,
      info: info.attributes.value,
      votes: 0,
    });
    navigate("/", {
      replace: false,
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    content.reset();
    author.reset();
    info.reset();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.attributes} />
        </div>
        <div>
          author
          <input {...author.attributes} />
        </div>
        <div>
          url for more info
          <input {...info.attributes} />
        </div>
        <button>create</button>
        <button onClick={handleReset}>reset</button>
      </form>
    </div>
  );
};

export default CreateNew;
