import { LitElement, html, css } from 'lit';
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

export class TaggingQuestion extends DDD {
  static get properties() {
    return {
      image: { type: String },
      question: { type: String },
      answerSet: { type: String },
      tagOptions: { type: Array },
      tagAnswers: { type: Array },
      submitted: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.image = '';
    this.question = '';
    this.answerSet = '';
    this.tagOptions = [];
    this.tagAnswers = [];
    this.submitted = false;
    this.loadTagsData();
  }

  static get styles() {
    return css`
      .tag-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 2px solid #ccc;
        border-radius: 8px;
        padding: 20px;
        max-width: 600px;
        margin: auto;
      }

      .image {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin-bottom: 16px;
      }

      .tag-option {
        padding: 8px 12px;
        margin: 4px;
        border: 2px solid #ccc;
        border-radius: 8px;
        cursor: pointer;
        user-select: none;
        background-color: #f0f0f0;
      }

      .user-choice-container {
        min-height: 100px;
        border: 2px dashed #ccc;
        border-radius: 8px;
        padding: 10px;
        margin-top: 16px;
      }

      #submit-button {
        padding: 10px 20px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 16px;
      }

      #submit-button:hover {
        background-color: #0056b3;
      }
    `;
  }

  render() {
    return html`
      <div class="tag-container">
        <img class="image" src="${this.image}" alt="Image">
        <p>${this.question}</p>
        <div>
          ${this.tagOptions.map(
            tagOption => html`
              <div
                class="tag-option"
                draggable="true"
                @dragstart="${(e) => this.handleDragStart(e, tagOption)}"
              >
                ${tagOption}
              </div>
            `
          )}
        </div>
        <div
          id="submit-area"
          class="user-choice-container"
          @dragover="${this.handleDragOver}"
          @drop="${this.handleDrop}"
          <p>Drag selected tags here to submit:</p>
          ${this.renderSelectedTags()}
        </div>
        <button id="submit-button" @click="${this.submitAnswers}">Submit</button>
      </div>
    `;
  }

  loadTagsData() {
    fetch("./src/tagging-answers.json")
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch tags data');
        }
        return response.json();
      })
      .then(tagsData => {
        const tagSet = tagsData[this.answerSet];
        if (tagSet) {
          this.tagOptions = tagSet.tagOptions || [];
          this.tagAnswers = tagSet.tagAnswers || [];
        } else {
          throw new Error(`tagSet '${this.answerSet}' not found`);
        }
        this.requestUpdate(); // Trigger re-render after data loading
      })
      .catch(error => {
        console.error('Error loading tags data: ', error);
      });
  }

  handleDragStart(event, tagOption) {
    event.dataTransfer.setData('text/plain', tagOption);
  }

  handleDragOver(event) {
    event.preventDefault();
  }

  handleDrop(event) {
    event.preventDefault();
    const tagOption = event.dataTransfer.getData('text/plain');
    this.addSelectedTag(tagOption);
  }

  addSelectedTag(tagOption) {
    if (!this.tagAnswers.includes(tagOption)) {
      this.tagAnswers = [...this.tagAnswers, tagOption];
      this.requestUpdate();
    }
  }
  firstUpdated() {
    this.loadTagsData();
  }

  renderSelectedTags() {
    return html`
      <div>
        ${this.tagAnswers.map(
          tag => html`
            <div class="tag-option" draggable="true" @dragstart="${(e) => this.handleDragStart(e, tag)}">
              ${tag}
            </div>
          `
        )}
      </div>
    `;
  }

  submitAnswers() {
    this.submitted = true;
    console.log('Submitted answers:', this.tagAnswers);
  }
}

customElements.define('tagging-question', TaggingQuestion);
