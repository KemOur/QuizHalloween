let Results = {
  props: ["answeredQuestions"],
  template: `
  <div>
  <h1>Results</h1>
      <h3 class="mb-4">
        💯 {{ countCorrectAnswers() }} / {{ answeredQuestions.length }}
        correct answers
      </h3>
      <h2 class="mb-4">👀 Your answers</h2>
      <div class="mt-4" v-for="answeredQuestion in answeredQuestions">
        <h4>{{ answeredQuestion.question.title }}</h4>
        <div
          :class="{'text-danger': !answeredQuestion.answer.correct, 'text-success': answeredQuestion.answer.correct}"
        >
          👉 Your answer: {{ answeredQuestion.answer.title }}
        </div>
        <div
          class="text-success"
          v-if="!answeredQuestion.answer.correct"
        >
          <strong
            >✅ &nbsp; Correct answer: {{
            getCorrectAnswer(answeredQuestion.question) }}</strong
          >
        </div>
      </div>
  </div>
  `,
  methods: {
    countCorrectAnswers() {
      return this.answeredQuestions.filter((answeredQuestion) => {
        return answeredQuestion.answer.correct == true;
      }).length;
    },
    getCorrectAnswer(question) {
      const correctAnswer = question.answers.find((answer) => {
        return answer.correct == true;
      });
      return correctAnswer.title;
    },
  },
};

let Question = {
  data() {
    return {
      enableNextButton: false,
      chosenAnswer: null,
    };
  },
  props: ["currentQuestion"],
  emits: ["next-question"],
  template: `
      <div v-if="currentQuestion">
        <h1>{{ currentQuestion.title }}</h1>
        <form class="form-check">
          <div
            v-for="answer in currentQuestion.answers"
            :key="answer.id"
          >
            <input
              type="radio"
              name="answer"
              :id="'answer-' + answer.id"
              class="form-check-input"
              @click="selectAnswer(answer)"
            />
            <label :for="'answer-' + answer.id" class="form-check-label"
              >{{ answer.title }}</label
            >
          </div>
          <button
            @click.prevent="$emit('next-question', chosenAnswer)"
            class="btn btn-primary mt-3"
            :disabled="!enableNextButton"
          >
            Next
          </button>
        </form>
      </div>`,
  methods: {
    selectAnswer(answer) {
      this.chosenAnswer = answer;
      this.enableNextButton = true;
    },
  },
};

let Quizz = {
  components: { question: Question, results: Results },
  template: `
      <div>
      <div v-if="showResults">
        <results :answeredQuestions="answeredQuestions"></results>
    </div>
    <div v-else>
      <h3 v-if="currentQuestion">
      ❓ Question {{ currentQuestion.id }}/{{ questions.length }}
    </h3>
      <question :currentQuestion="currentQuestion" @next-question="next"></question>
    </div>
    </div>`,
  data() {
    return {
      questions: [],
      currentQuestion: {},
      currentQuestionNumber: 1,
      showResults: false,
      answeredQuestions: [],
    };
  },
  methods: {
    next(chosenAnswer) {
      this.answeredQuestions.push({
        question: this.currentQuestion,
        answer: chosenAnswer,
      });

      if (this.currentQuestionNumber === this.questions.length) {
        this.showResults = true;
        return;
      }

      this.currentQuestionNumber++;
      this.currentQuestion = this.questions[this.currentQuestionNumber - 1];
    },
  },
  mounted() {
    fetch("http://0.0.0.0:8080/data/halloween.json").then((response) => {
      response.json().then((data) => {
        this.questions = data;
        this.currentQuestion = this.questions[0];
      });
    });
  },
};

Vue.createApp({
  components: { quizz: Quizz },
}).mount("#app");
