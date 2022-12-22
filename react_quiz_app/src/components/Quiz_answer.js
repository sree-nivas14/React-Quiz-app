import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Quiz_answer.css";

function Quiz_answer({ score, handle, question_count }) {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showAnswers, setShowAnswers] = useState([]);
  const [processedAnswers, setProcessedAnswers] = useState([]);
  const [question_len, setQuestion_len] = useState(0);
  const [checked_ques, setChecked_ques] = useState(0);

  const [quiz_start, setQuiz_start] = useState(false);

  const [QuizData, setQuizData] = useState([]);

  const fetchQuizData = async () => {
    document.getElementById("fp-container").style.visibility = "visible";

    try {
      const url = `https://opentdb.com/api.php?amount=${question_count}&category=9&difficulty=easy`;
      const { data } = await axios.get(url);
      console.log("calling");
      // console.log("data", data);

      const formattedCategory = data.results.map((cat) => {
        document.getElementById("fp-container").style.visibility = "hidden";
        const incorrectAnswersIndexes = cat.incorrect_answers.length;
        const randomIndex = Math.round(
          Math.random() * (incorrectAnswersIndexes - 0) + 0
        );

        cat.incorrect_answers.splice(randomIndex, 0, cat.correct_answer);

        return {
          ...cat,
          answers: cat.incorrect_answers,
        };
      });
      console.log(formattedCategory);
      setQuestion_len(formattedCategory.length);
      setQuizData(formattedCategory);
    } catch (error) {
      document.getElementById("fp-container").style.visibility = "visible";

      alert("Something went wrong");
      window.location.reload();
      console.log("Fetch quiz error =====>>>>", error);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, []);

  const handleAnswerChange = (e, selectedQuestion) => {
    e.preventDefault();
    const { value } = e.target;
    // console.log(value, selectedQuestion);

    const isExistQuestion =
      selectedAnswers.length &&
      selectedAnswers.find((answer) => answer.question === selectedQuestion);
    // console.log(selectedAnswers);

    if (isExistQuestion && isExistQuestion.answer) {
      const updatedAnswers = selectedAnswers.map((answer) => {
        if (answer.question === selectedQuestion) {
          return { question: selectedQuestion, answer: value };
        }
        return answer;
      });
      setSelectedAnswers(updatedAnswers);
      console.log("updated anwser:", updatedAnswers);
    } else {
      setSelectedAnswers([
        ...selectedAnswers,
        { question: selectedQuestion, answer: value },
      ]);
      // console.log(selectedAnswers);
    }
  };

  useEffect(() => {
    setChecked_ques(selectedAnswers.length);
  }, [selectedAnswers]);

  const relatedAnswer = (question, selectedAnswers) => {
    console.log(question, selectedAnswers);
    if (selectedAnswers && selectedAnswers.length) {
      const relatedQuestion = selectedAnswers.find(
        (answer) => answer.question === question
      );
      return (relatedQuestion && relatedQuestion.answer) || "";
    }
    return "";
  };

  function handleResult(e) {
    e.preventDefault();
    console.log(selectedAnswers);
    setShowAnswers(selectedAnswers);
    const processedAnswers = selectedAnswers.map(({ answer, question }) => {
      const relatedQuestion = QuizData.find(
        (category) => category.question === question
      );
      if (relatedQuestion.correct_answer === answer) {
        return { correctAnswer: answer, isCorrect: true, question };
      }
      return {
        correctAnswer: relatedQuestion.correct_answer,
        wrongAnswer: answer,
        isCorrect: false,
        question,
      };
    });

    setProcessedAnswers(processedAnswers);
    // console.log(processedAnswers);
    const crt_answers = processedAnswers.filter(
      ({ isCorrect }) => isCorrect
    ).length;

    //it show correct answer count
    // alert(
    //   processedAnswers.filter(({ isCorrect }) => isCorrect).length +
    //     " out of " +
    //     processedAnswers.length
    // );
    score(crt_answers);
    document.getElementById("modal_close_btn").click();
    // props.func(selectedAnswers);
    setQuiz_start(true);
    setQuizData([]);
    setSelectedAnswers([]);
  }

  return (
    <div className="">
      {!quiz_start ? (
        <>
          <div className="row border border-2 border-light">
            <div className="col-md-2 d-flex justify-content-center">
              <div className="mt-5 fs-5 " style={{ position: "fixed" }}>
                <div className=" d-flex">
                  Total No Of Questions : {question_len}
                </div>
                <div className="my-3 d-flex">
                  Answered Questions : {checked_ques}
                </div>
                <div className=" d-flex">
                  Unanswered Questions :{question_len - checked_ques}
                </div>
              </div>
            </div>

            <div className="col-md-10">
              <div>
                <form>
                  <div className="card border-0">
                    <div className="card-body bg-color">
                      <div
                        className="fp-container"
                        id="fp-container"
                        style={{ visibility: "hidden" }}
                      >
                        <i
                          className="fas fa-spinner fa-pulse fp-loader"
                          style={{ fontSize: "70px" }}
                        ></i>
                      </div>
                      {QuizData.map((quiz, i) => (
                        <div className="border border-2 shadow rounded my-1">
                          <ul className="list-unstyled">
                            <li className="p-2">
                              <span className="fw-bolder pe-2">{i + 1}.</span>
                              {quiz.question}
                            </li>
                          </ul>

                          <ul
                            className="nav nav-pills"
                            id="pills-tab"
                            role="tablist"
                          >
                            <li
                              className="nav-item  mx-3 my-2"
                              role="presentation"
                            >
                              {quiz.answers.map((ans, i) => (
                                <>
                                  <button
                                    className="nav-link ans_btn"
                                    id="pills-home-tab"
                                    data-bs-toggle="pill"
                                    type="button"
                                    value={ans}
                                    onClick={(e) =>
                                      handleAnswerChange(e, quiz.question)
                                    }
                                  >
                                    {ans}
                                  </button>
                                </>
                              ))}
                            </li>
                          </ul>
                          <br />
                        </div>
                      ))}
                      <div className="text-center">
                        <button
                          type="button"
                          className="btn btn-success my-3"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          submit
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                <div
                  className="modal fade"
                  id="exampleModal"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                          Do u want to submit the data?
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          id="modal_close_btn"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div>Total No Of Questions : {question_len}</div>
                        <div>Answered Questions : {checked_ques}</div>
                        <div>
                          Unanswered Questions :{question_len - checked_ques}
                        </div>

                        {question_len == question_len - checked_ques ? (
                          <h6 className="text-danger">
                            <hr />
                            Note: You didn't choose anything from this
                            section.If you move another section, you can't
                            attend this section again.
                          </h6>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary "
                          onClick={(e) => {
                            handleResult(e);
                            handle();
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="">
          <div className="card ">
            <div className="card-body">
              {processedAnswers.length == 0 ? (
                <h3 className="text-center">You didn't choose anything!!</h3>
              ) : (
                <>
                  <h5>Your Selected Answers:</h5>

                  {showAnswers.map((e) => (
                    <div className="border border-2 shadow rounded my-2 py-2">
                      <ul>
                        <li className="pb-3">{e.question}</li>
                        <button type="button" className="btn btn-success ">
                          {e.answer}
                        </button>
                      </ul>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz_answer;
