// import { html, css, LitElement } from 'lit';
// import { customElement, property } from 'lit/decorators.js';
// // import 'uno.css'; // 引入 UnoCSS
//
// @customElement('my-form')
// export class MyForm extends LitElement {
//     @property({ type: String }) name = '';
//     @property({ type: String }) email = '';
//     @property({ type: String }) gender = '';
//
//     static styles = css`
//     /* 自定义样式 */
//     .form-container {
//       @apply p-4 bg-gray-100 rounded-lg;
//     }
//     .form-input {
//       @apply border p-2 mb-4 w-full rounded-md;
//     }
//     .form-label {
//       @apply block font-medium mb-2;
//     }
//     .submit-button {
//       @apply bg-blue-500 text-white p-2 rounded hover:bg-blue-600;
//     }
//   `;
//
//     render() {
//         return html`
//       <div class="form-container">
//         <form @submit=${this.handleSubmit}>
//           <label class="form-label" for="name">Name</label>
//           <input
//             class="form-input"
//             type="text"
//             id="name"
//             .value=${this.name}
//             @input=${(e: Event) => (this.name = (e.target as HTMLInputElement).value)}
//           />
//
//           <label class="form-label" for="email">Email</label>
//           <input
//             class="form-input"
//             type="email"
//             id="email"
//             .value=${this.email}
//             @input=${(e: Event) => (this.email = (e.target as HTMLInputElement).value)}
//           />
//
//           <label class="form-label" for="gender">Gender</label>
//           <select
//             class="form-input"
//             id="gender"
//             .value=${this.gender}
//             @change=${(e: Event) => (this.gender = (e.target as HTMLSelectElement).value)}
//           >
//             <option value="">Select Gender</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//           </select>
//
//           <button type="submit" class="submit-button">Submit</button>
//         </form>
//       </div>
//     `;
//     }
//
//     handleSubmit(e: Event) {
//         e.preventDefault();
//         console.log(`Name: ${this.name}, Email: ${this.email}, Gender: ${this.gender}`);
//     }
// }
