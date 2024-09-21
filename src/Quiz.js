import React, { useState, useEffect } from 'react';
import { quizData, quizTitle } from './quizData';
import { post } from 'aws-amplify/api';

function Quiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState(null);
    const [timeLeft, setTimeLeft] = useState(20);
    const [hasStarted, setHasStarted] = useState(false);
    const [userName, setUserName] = useState("");
    const [userAnswers, setUserAnswers] = useState([]);
    const [quizCompleted, setQuizCompleted] = useState(false);

    useEffect(() => {
        if (timeLeft > 0 && !showScore && hasStarted) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        } else if (timeLeft === 0) {
            handleNextQuestion();
        }
    }, [timeLeft, showScore, hasStarted]);

    const handleAnswerOptionClick = (option) => {
        if (selectedAnswer === "") {
            const correctAnswer = quizData[currentQuestion].answer;
            setSelectedAnswer(option);

            setUserAnswers(prevAnswers => {
                const newAnswers = [...prevAnswers];
                newAnswers[currentQuestion] = option;
                return newAnswers;
            });

            if (option === correctAnswer) {
                setScore(prevScore => prevScore + 1);
                setIsCorrect(true);
            } else {
                setIsCorrect(false);
            }

            if (currentQuestion === quizData.length - 1) {
                setQuizCompleted(true);
            } else {
                setTimeout(handleNextQuestion, 500);
            }
        }
    };

    const handleNextQuestion = () => {
        setUserAnswers(prevAnswers => {
            const newAnswers = [...prevAnswers];
            if (!newAnswers[currentQuestion]) {
                newAnswers[currentQuestion] = "No answer";
            }
            return newAnswers;
        });

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < quizData.length) {
            setCurrentQuestion(nextQuestion);
            setIsCorrect(null);
            setSelectedAnswer("");
            setTimeLeft(20);
        } else {
            setQuizCompleted(true);
        }
    };

    const handleStartClick = () => {
        if (userName.trim() !== "") {
            setHasStarted(true);
            setUserAnswers(Array(quizData.length).fill("No answer"));
        } else {
            alert("Please enter your name before starting the quiz.");
        }
    };

    // const handleSubmit = async () => {
    //     // Thực hiện POST request ở đây
    //     try {
    //         const restOperation = post({
    //             apiName: 'quizsApi',
    //             path: '/items',
    //             options: {
    //                 body: {
    //                     userName: userName,
    //                     score: score,
    //                     answers: userAnswers,
    //                 },
    //             }
    //         })
    //         const response = await restOperation.response;
    //         const result = await response.body.json();

    //         if (response.statusCode === 200) {
    //             console.log('Quiz results submitted successfully', result);
    //             setShowScore(true);
    //         } else {
    //             console.error('Failed to submit quiz results', result);
    //         }
    //     } catch (error) {
    //         console.error('Error submitting quiz results:', error);
    //     }
    // };
    const handleSubmit = async () => {
        try {
            const quizData = {
                userName: userName,
                score: score,
                answers: userAnswers,
            };
            console.log('Submitting quiz data:', quizData);

            const restOperation = await post({
                apiName: 'QuizAPI',
                path: '/items',
                options: {
                    body: quizData,
                }
            });

            const response = await restOperation.response;
            const result = await response.body.json();

            console.log('API response:', result);

            if (response.statusCode === 200) {
                console.log('Quiz results submitted successfully', result);
                setShowScore(true);
            } else {
                console.error('Failed to submit quiz results', result);
            }
        } catch (error) {
            console.error('Error submitting quiz results:', error);
        }
    };
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];

    const renderResults = () => {
        return quizData.map((question, index) => (
            <div key={index} style={{ marginBottom: '20px', textAlign: 'left' }}>
                <p><strong>Question {index + 1}:</strong> {question.question}</p>
                <p>Your answer: <span style={{ color: userAnswers[index] === question.answer ? 'green' : 'red' }}>
                    {userAnswers[index]}
                </span></p>
                <p>Correct answer: {question.answer}</p>
            </div>
        ));
    };

    return (
        <div className='quiz' style={{ textAlign: 'center', maxWidth: '1080px', margin: '0 auto', padding: '20px' }}>
            {!hasStarted ? (
                <div className='intro-section' style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    <h1>Welcome to the Quiz!</h1>
                    <p>{quizTitle}</p>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        style={{
                            padding: '10px',
                            fontSize: '18px',
                            marginTop: '20px',
                            width: '300px'
                        }}
                    />
                    <br />
                    <button
                        onClick={handleStartClick}
                        style={{
                            backgroundColor: '#4ECDC4',
                            border: 'none',
                            padding: '15px 30px',
                            fontSize: '18px',
                            cursor: 'pointer',
                            color: 'white',
                            borderRadius: '5px',
                            marginTop: '20px',
                        }}
                    >
                        Bắt đầu
                    </button>
                </div>
            ) : showScore ? (
                <div className='score-section' style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    <h2>{userName}, you scored {score} out of {quizData.length}</h2>
                    <div style={{ marginTop: '30px' }}>
                        <h3>Detailed Results:</h3>
                        {renderResults()}
                    </div>
                </div>
            ) : (
                <>
                    <div className='question-section'>
                        <div className='question-count' style={{ fontSize: '36px', marginBottom: '70px' }}>
                            <span>Question {currentQuestion + 1}</span>/{quizData.length}
                        </div>
                        <div className='question-text' style={{ fontSize: '36px', marginBottom: '20px', }}>{quizData[currentQuestion].question}</div>
                    </div>
                    <div className='answer-section' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '200px', rowGap: '20px' }}>
                        {quizData[currentQuestion].options.map((option, index) => (
                            <button
                                onClick={() => handleAnswerOptionClick(option)}
                                key={option}
                                style={{
                                    backgroundColor: selectedAnswer === option
                                        ? (isCorrect ? 'lightgreen' : 'pink')
                                        : colors[index],
                                    border: 'none',
                                    padding: '10px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    color: 'white',
                                    borderRadius: '5px',
                                    width: '300px',
                                    height: '80px',
                                }}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    {selectedAnswer && (
                        <div style={{ marginTop: '20px', fontSize: '24px', position: 'absolute', top: 20, right: 30 }}>
                            {isCorrect ? <span style={{ padding: '18px 30px', backgroundColor: "green", borderRadius: '10px' }}>Correct! 🎉</span>
                                : <span style={{ padding: '18px 30px', backgroundColor: "#FF6B6B", borderRadius: '10px' }}>Sorry, that is not right. 😢</span>}
                        </div>
                    )}
                    <div className='timer' style={{ fontSize: '24px', marginBottom: '30px', marginTop: '30px', fontWeight: '500' }}>Time left: {timeLeft}s</div>
                    {quizCompleted && (
                        <button
                            onClick={handleSubmit}
                            style={{
                                backgroundColor: '#4ECDC4',
                                border: 'none',
                                padding: '15px 30px',
                                fontSize: '18px',
                                cursor: 'pointer',
                                color: 'white',
                                borderRadius: '5px',
                                marginTop: '20px',
                            }}
                        >
                            Nộp bài
                        </button>
                    )}
                </>
            )}
        </div>
    );
}

export default Quiz;