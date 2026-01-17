/**
 * CKEditor 5 Definition List Plugin for TYPO3
 *
 * Provides <dl>, <dt>, <dd> support in CKEditor 5
 */
import {Command, Plugin} from '@ckeditor/ckeditor5-core';
import {addListToDropdown, ButtonView, createDropdown, ViewModel} from '@ckeditor/ckeditor5-ui';
import {Collection} from '@ckeditor/ckeditor5-utils';
import {Enter} from '@ckeditor/ckeditor5-enter';
import {Delete} from '@ckeditor/ckeditor5-typing';

// SVG icon for the definition list button
const definitionListIcon = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 3h3v2H2V3zm5 0h11v2H7V3zM2 8h3v2H2V8zm5 0h11v2H7V8zM2 13h3v2H2v-2zm5 0h11v2H7v-2z"/></svg>';

/**
 * Command to insert a new definition list
 */
class InsertDefinitionListCommand extends Command {
  execute() {
    const model = this.editor.model;

    model.change(writer => {
      const definitionList = writer.createElement('definitionList');
      const definitionTerm = writer.createElement('definitionTerm');
      const definitionDesc = writer.createElement('definitionDescription');

      writer.append(definitionTerm, definitionList);
      writer.append(definitionDesc, definitionList);

      model.insertContent(definitionList);

      // Set selection to the term
      writer.setSelection(definitionTerm, 'in');
    });
  }

  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const allowedIn = model.schema.findAllowedParent(
      selection.getFirstPosition(),
      'definitionList'
    );

    this.isEnabled = allowedIn !== null;
  }
}

/**
 * Command to insert a new definition term in the current list
 */
class InsertDefinitionTermCommand extends Command {
  execute() {
    const model = this.editor.model;
    const selection = model.document.selection;

    model.change(writer => {
      const definitionList = this._findDefinitionList(selection.getFirstPosition());

      if (definitionList) {
        const newTerm = writer.createElement('definitionTerm');
        const position = selection.getFirstPosition();

        // Find the current element and insert after it
        let currentElement = position.parent;
        while (currentElement && currentElement.name !== 'definitionTerm' && currentElement.name !== 'definitionDescription') {
          currentElement = currentElement.parent;
        }

        if (currentElement) {
          writer.insert(newTerm, currentElement, 'after');
        } else {
          writer.append(newTerm, definitionList);
        }

        writer.setSelection(newTerm, 'in');
      }
    });
  }

  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const position = selection.getFirstPosition();

    this.isEnabled = this._findDefinitionList(position) !== null;
  }

  _findDefinitionList(position) {
    let element = position.parent;

    while (element) {
      if (element.name === 'definitionList') {
        return element;
      }
      element = element.parent;
    }

    return null;
  }
}

/**
 * Command to insert a new definition description in the current list
 */
class InsertDefinitionDescriptionCommand extends Command {
  execute() {
    const model = this.editor.model;
    const selection = model.document.selection;

    model.change(writer => {
      const definitionList = this._findDefinitionList(selection.getFirstPosition());

      if (definitionList) {
        const newDesc = writer.createElement('definitionDescription');
        const position = selection.getFirstPosition();

        // Find the current element and insert after it
        let currentElement = position.parent;
        while (currentElement && currentElement.name !== 'definitionTerm' && currentElement.name !== 'definitionDescription') {
          currentElement = currentElement.parent;
        }

        if (currentElement) {
          writer.insert(newDesc, currentElement, 'after');
        } else {
          writer.append(newDesc, definitionList);
        }

        writer.setSelection(newDesc, 'in');
      }
    });
  }

  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const position = selection.getFirstPosition();

    this.isEnabled = this._findDefinitionList(position) !== null;
  }

  _findDefinitionList(position) {
    let element = position.parent;

    while (element) {
      if (element.name === 'definitionList') {
        return element;
      }
      element = element.parent;
    }

    return null;
  }
}

/**
 * Command to remove the current definition list
 */
class RemoveDefinitionListCommand extends Command {
  execute() {
    const model = this.editor.model;
    const selection = model.document.selection;

    model.change(writer => {
      const definitionList = this._findDefinitionList(selection.getFirstPosition());

      if (definitionList) {
        // Get all text content before removing
        let textContent = '';
        for (const child of definitionList.getChildren()) {
          const text = Array.from(child.getChildren())
            .filter(item => item.is('$text'))
            .map(item => item.data)
            .join('');
          if (text) {
            textContent += text + '\n';
          }
        }

        // Remove the definition list
        writer.remove(definitionList);

        // Insert a paragraph with the extracted content
        if (textContent.trim()) {
          const paragraph = writer.createElement('paragraph');
          writer.insertText(textContent.trim(), paragraph);
          model.insertContent(paragraph);
        }
      }
    });
  }

  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const position = selection.getFirstPosition();

    this.isEnabled = this._findDefinitionList(position) !== null;
  }

  _findDefinitionList(position) {
    let element = position.parent;

    while (element) {
      if (element.name === 'definitionList') {
        return element;
      }
      element = element.parent;
    }

    return null;
  }
}

/**
 * Definition List Editing Plugin
 * Handles the model/schema definition and data conversion
 */
class DefinitionListEditing extends Plugin {
  static get pluginName() {
    return 'DefinitionListEditing';
  }

  static get requires() {
    return [Enter, Delete];
  }

  init() {
    const editor = this.editor;
    const schema = editor.model.schema;

    // Define schema for definition list elements
    schema.register('definitionList', {
      inheritAllFrom: '$container',
      allowIn: ['$root', '$container'],
      isBlock: true
    });

    schema.register('definitionTerm', {
      inheritAllFrom: '$block',
      allowIn: 'definitionList',
      isBlock: true,
      allowContentOf: '$block'
    });

    schema.register('definitionDescription', {
      inheritAllFrom: '$block',
      allowIn: 'definitionList',
      isBlock: true,
      allowContentOf: '$block'
    });

    // Define conversion from model to view (editing view and data view)
    this._defineConverters();

    // Define commands
    this._defineCommands();
  }

  _defineConverters() {
    const conversion = this.editor.conversion;

    // Definition List <dl>
    conversion.for('upcast').elementToElement({
      model: 'definitionList',
      view: 'dl'
    });

    conversion.for('dataDowncast').elementToElement({
      model: 'definitionList',
      view: (modelElement, {writer: viewWriter}) => {
        return viewWriter.createContainerElement('dl', {
          class: 'description-list'
        });
      }
    });

    conversion.for('editingDowncast').elementToElement({
      model: 'definitionList',
      view: (modelElement, {writer: viewWriter}) => {
        const dl = viewWriter.createContainerElement('dl', {
          class: 'description-list ck-definition-list'
        });
        return dl;
      }
    });

    // Definition Term <dt>
    conversion.for('upcast').elementToElement({
      model: 'definitionTerm',
      view: 'dt'
    });

    conversion.for('dataDowncast').elementToElement({
      model: 'definitionTerm',
      view: (modelElement, {writer: viewWriter}) => {
        return viewWriter.createContainerElement('dt', {
          class: 'description-term'
        });
      }
    });

    conversion.for('editingDowncast').elementToElement({
      model: 'definitionTerm',
      view: (modelElement, {writer: viewWriter}) => {
        const dt = viewWriter.createContainerElement('dt', {
          class: 'description-term ck-definition-term'
        });
        return dt;
      }
    });

    // Definition Description <dd>
    conversion.for('upcast').elementToElement({
      model: 'definitionDescription',
      view: 'dd'
    });

    conversion.for('dataDowncast').elementToElement({
      model: 'definitionDescription',
      view: (modelElement, {writer: viewWriter}) => {
        return viewWriter.createContainerElement('dd', {
          class: 'description-element'
        });
      }
    });

    conversion.for('editingDowncast').elementToElement({
      model: 'definitionDescription',
      view: (modelElement, {writer: viewWriter}) => {
        const dd = viewWriter.createContainerElement('dd', {
          class: 'description-element ck-definition-description'
        });
        return dd;
      }
    });
  }

  _defineCommands() {
    const editor = this.editor;

    editor.commands.add('insertDefinitionList', new InsertDefinitionListCommand(editor));
    editor.commands.add('insertDefinitionTerm', new InsertDefinitionTermCommand(editor));
    editor.commands.add('insertDefinitionDescription', new InsertDefinitionDescriptionCommand(editor));
    editor.commands.add('removeDefinitionList', new RemoveDefinitionListCommand(editor));
  }
}

/**
 * Definition List UI Plugin
 * Provides toolbar button and dropdown menu
 */
class DefinitionListUI extends Plugin {
  static get pluginName() {
    return 'DefinitionListUI';
  }

  init() {
    const editor = this.editor;
    const t = editor.t;

    // Register the main dropdown button
    editor.ui.componentFactory.add('definitionList', locale => {
      const dropdownView = createDropdown(locale);
      const items = new Collection();

      // Add dropdown items
      items.add({
        type: 'button',
        model: new ViewModel({
          id: 'insertDefinitionList',
          label: t('Insert Definition List'),
          withText: true
        })
      });

      items.add({
        type: 'button',
        model: new ViewModel({
          id: 'insertDefinitionTerm',
          label: t('Add Term (dt)'),
          withText: true
        })
      });

      items.add({
        type: 'button',
        model: new ViewModel({
          id: 'insertDefinitionDescription',
          label: t('Add Description (dd)'),
          withText: true
        })
      });

      items.add({
        type: 'separator'
      });

      items.add({
        type: 'button',
        model: new ViewModel({
          id: 'removeDefinitionList',
          label: t('Remove Definition List'),
          withText: true
        })
      });

      addListToDropdown(dropdownView, items);

      // Configure dropdown button
      dropdownView.buttonView.set({
        label: t('Definition List'),
        icon: definitionListIcon,
        tooltip: true
      });

      // Bind dropdown items to commands
      dropdownView.on('execute', evt => {
        const commandName = evt.source.id;

        if (commandName) {
          editor.execute(commandName);
          editor.editing.view.focus();
        }
      });

      // Bind isEnabled to commands
      const insertCommand = editor.commands.get('insertDefinitionList');
      dropdownView.bind('isEnabled').to(insertCommand, 'isEnabled');

      return dropdownView;
    });

    // Register individual buttons for keyboard shortcuts or alternative UI
    this._registerButton('insertDefinitionList', t('Insert Definition List'), definitionListIcon);
  }

  _registerButton(commandName, label, icon) {
    const editor = this.editor;

    editor.ui.componentFactory.add(commandName, locale => {
      const command = editor.commands.get(commandName);
      const buttonView = new ButtonView(locale);

      buttonView.set({
        label: label,
        icon: icon,
        tooltip: true
      });

      buttonView.bind('isEnabled').to(command, 'isEnabled');

      buttonView.on('execute', () => {
        editor.execute(commandName);
        editor.editing.view.focus();
      });

      return buttonView;
    });
  }
}

/**
 * Main Definition List Plugin
 * Combines editing and UI functionality
 */
export class DefinitionList extends Plugin {
  static get pluginName() {
    return 'DefinitionList';
  }

  static get requires() {
    return [DefinitionListEditing, DefinitionListUI];
  }
}

// Export for TYPO3 module system
export default DefinitionList;

