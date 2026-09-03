import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import CapsLockIndicator from "./CapsLockIndicator";
import Input from "./Input";
import TextCharacters from "./TextCharacters";
import TypeStatistics from "./TypeStatistics";
import { startTyping, stopTyping, updateTimeDuration } from "../store/typer.slice";
import "./styles/Tester.scss";

const Tester: React.FC = () => {
  const [printedText, setPrintedText] = React.useState("");
  const text = useAppSelector(({ typer: { text } }) => text);
  const status = useAppSelector(state => state.typer.status);
  const inputText = useAppSelector(state => state.typer.inputText);
  const dispatch = useAppDispatch();
  const textForTestRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    if (!status) {
      return;
    }

    const intervalId = window.setInterval(() => {
      dispatch(updateTimeDuration());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [dispatch, status]);

  const startHandler = () => {
    setPrintedText("");
    dispatch(startTyping());
  };

  const stopHandler = () => {
    dispatch(stopTyping());
  };

  const startButtonText = text ? "Restart" : "Start";

  React.useEffect(() => {
    const textElement = textForTestRef.current;
    if (!textElement || !text.length) {
      return;
    }

    const scrollableHeight = textElement.scrollHeight - textElement.clientHeight;
    const progress = inputText.length / text.length;
    textElement.scrollTop = scrollableHeight * progress;
  }, [inputText.length, text.length]);

  return (
    <div className={`testWrapper ${!text ? "testWrapperEmpty" : ""}`}>
      {text && (
        <>
          <p
            ref={textForTestRef}
            className="textForTest"
            dangerouslySetInnerHTML={{
              __html: !printedText ? text : printedText,
            }}
          />
          <TextCharacters text={text} />
          <TypeStatistics />
          <CapsLockIndicator />
        </>
      )}
      <div className="controls">
        <button
          className="btn btn-success text-uppercase"
          onClick={startHandler}
          disabled={status}
        >
          {startButtonText}
        </button>
        {status && (
          <button
            className="btn btn-danger text-uppercase"
            onClick={stopHandler}
          >
            Stop
          </button>
        )}
      </div>
      {text && (
        <Input
          text={text}
          setPrintedText={setPrintedText}
        />
      )}
    </div>
  );
};

export default Tester;
