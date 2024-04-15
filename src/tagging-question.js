import { LitElement, html, css } from 'lit';

class TagQuestion extends LitElement {

  static get properties() {
    return {
      question: { type: String }, // The question text
      imageUrl: { type: String }, // URL of the optional image
      tagsData: { type: Array }, // Array of tag objects { tag: string, correct: boolean, feedback: string }
    };
  }

  constructor() {
    super();
    this.question = '';
    this.image = '';
    this.dataTags = [];
    this.chooseTags = [];
    this.check = false;
  }

 
  render() {
    return html`
      ${this.image ? html`<img src="${this.image}" alt="Question Image">` : ''}
      <div>${this.question}</div>
      <div class="tags-container">
        ${this.shuffleTags().map(tag => html`
          <div class="tag ${this.selectedTags.includes(tag) ? 'selected' : ''}" @click="${() => this.toggleTag(tag)}">${tag}</div>
        `)}
      </div>
      <div class="button-container">
        <button @click="${this.checkAnswers}" ?disabled="${this.isChecking}">Check Answers</button>
        <button @click="${this.resetSelections}">Reset</button>
      </div>
      ${this.isChecking ? this.renderFeedback() : ''}
    `;
  }

}

customElements.define('tagging-q', TagQuestion);