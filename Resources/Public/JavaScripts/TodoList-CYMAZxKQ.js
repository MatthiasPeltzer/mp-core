import { C as createBaseVNode, E as createElementBlock, F as renderList, I as watch, N as onMounted, O as createTextVNode, P as openBlock, R as withDirectives, S as computed, T as createCommentVNode, b as Fragment, j as nextTick, nt as toDisplayString, tt as normalizeClass, z as ref } from "./vendor-swiper-C4peFqeO.js";
import { n as vModelText, r as withModifiers } from "./vendor-vue-BzJnYTXS.js";
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region Assets/Scripts/components/TodoList.vue
var _hoisted_1 = {
	class: "card shadow my-4",
	style: { "max-width": "650px" },
	"aria-labelledby": "todo-title"
};
var _hoisted_2 = {
	role: "status",
	"aria-live": "polite",
	"aria-atomic": "true",
	class: "visually-hidden"
};
var _hoisted_3 = {
	id: "todo-title",
	class: "card-title text-center mb-0 h4"
};
var _hoisted_4 = { class: "card-body p-4" };
var _hoisted_5 = {
	for: "new-todo-input",
	class: "visually-hidden"
};
var _hoisted_6 = { class: "input-group input-group-lg" };
var _hoisted_7 = ["placeholder"];
var _hoisted_8 = ["disabled", "aria-label"];
var _hoisted_9 = {
	id: "todo-help",
	class: "visually-hidden"
};
var _hoisted_10 = {
	key: 0,
	class: "d-flex justify-content-center mb-4"
};
var _hoisted_11 = {
	class: "btn-group shadow-sm",
	role: "group",
	"aria-label": "Filter todo list"
};
var _hoisted_12 = ["checked", "aria-label"];
var _hoisted_13 = {
	class: "btn btn-outline-secondary me-2",
	for: "filter-all"
};
var _hoisted_14 = ["aria-label"];
var _hoisted_15 = ["checked", "aria-label"];
var _hoisted_16 = {
	class: "btn btn-outline-secondary me-2",
	for: "filter-active"
};
var _hoisted_17 = ["aria-label"];
var _hoisted_18 = ["checked", "aria-label"];
var _hoisted_19 = {
	class: "btn btn-outline-secondary",
	for: "filter-completed"
};
var _hoisted_20 = ["aria-label"];
var _hoisted_21 = {
	key: 1,
	class: "text-center text-muted py-5",
	role: "status",
	"aria-live": "polite"
};
var _hoisted_22 = { class: "fs-5" };
var _hoisted_23 = {
	key: 2,
	class: "list-group list-group-flush",
	role: "list",
	"aria-label": "Todo items"
};
var _hoisted_24 = { class: "form-check form-switch" };
var _hoisted_25 = [
	"id",
	"checked",
	"onChange",
	"aria-label",
	"aria-checked"
];
var _hoisted_26 = ["for"];
var _hoisted_27 = [
	"onClick",
	"aria-label",
	"title"
];
var _hoisted_28 = {
	key: 3,
	class: "d-flex justify-content-between align-items-center pt-4 mt-3 border-top",
	role: "status",
	"aria-live": "polite",
	"aria-atomic": "true"
};
var _hoisted_29 = {
	class: "text-muted",
	"aria-label": "Task summary"
};
var _hoisted_30 = {
	key: 0,
	class: "ms-2"
};
var _hoisted_31 = ["aria-label"];
var TodoList_default = /*#__PURE__*/ _plugin_vue_export_helper_default({
	__name: "TodoList",
	setup(__props) {
		const translations = {
			en: {
				cardTitle: "My To-Do List",
				placeholder: "What needs to be done?",
				add: "Add",
				all: "All",
				active: "Active",
				done: "Done",
				delete: "Delete",
				clearCompleted: "Clear Completed",
				task: "task",
				tasks: "tasks",
				remaining: "remaining",
				emptyAll: "No todos yet! Add one above.",
				emptyActive: "All done! Great job!",
				emptyCompleted: "No completed tasks yet.",
				addedTask: "Added task",
				markedCompleted: "Marked as completed",
				markedActive: "Marked as active",
				deletedTask: "Deleted task",
				cleared: "Cleared",
				maxReached: "Cannot add more tasks. Maximum of {max} items reached.",
				totalTasks: "total tasks",
				activeTasks: "active",
				completedTasks: "completed",
				showAll: "Show all tasks",
				showActive: "Show active tasks only",
				showCompleted: "Show completed tasks only",
				markAs: "Mark {text} as {state}",
				max: "max"
			},
			de: {
				cardTitle: "Meine Aufgabenliste",
				placeholder: "Was muss erledigt werden?",
				add: "Hinzufügen",
				all: "Alle",
				active: "Aktiv",
				done: "Erledigt",
				delete: "Löschen",
				clearCompleted: "Erledigte löschen",
				task: "Aufgabe",
				tasks: "Aufgaben",
				remaining: "verbleibend",
				emptyAll: "Noch keine Aufgaben! Füge eine oben hinzu.",
				emptyActive: "Alles erledigt! Großartig!",
				emptyCompleted: "Noch keine erledigten Aufgaben.",
				addedTask: "Aufgabe hinzugefügt",
				markedCompleted: "Als erledigt markiert",
				markedActive: "Als aktiv markiert",
				deletedTask: "Aufgabe gelöscht",
				cleared: "Gelöscht",
				maxReached: "Kann keine weiteren Aufgaben hinzufügen. Maximum von {max} Einträgen erreicht.",
				totalTasks: "Aufgaben insgesamt",
				activeTasks: "aktiv",
				completedTasks: "erledigt",
				showAll: "Alle Aufgaben anzeigen",
				showActive: "Nur aktive Aufgaben anzeigen",
				showCompleted: "Nur erledigte Aufgaben anzeigen",
				markAs: "{text} als {state} markieren",
				max: "max"
			}
		};
		const getLanguage = () => {
			const lang = (document.documentElement.lang || "en").split("-")[0].toLowerCase();
			return translations[lang] ? lang : "en";
		};
		const currentLang = ref(getLanguage());
		const t = computed(() => translations[currentLang.value]);
		const config = ref({
			showDelete: true,
			showFilter: true,
			showClear: true,
			maxItems: 50,
			cardTitle: "",
			colorScheme: "primary",
			predefinedItems: ""
		});
		const todos = ref([]);
		const loadTodos = () => {
			const saved = sessionStorage.getItem("todos");
			if (saved) try {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) return parsed;
			} catch {}
			if (config.value.predefinedItems) {
				const items = config.value.predefinedItems.split("\n").map((line) => line.trim()).filter((line) => line.length > 0).map((text, index) => ({
					id: index + 1,
					text,
					completed: false
				}));
				if (items.length > 0) return items;
			}
			return [
				{
					id: 1,
					text: "Learn Vue 3",
					completed: false
				},
				{
					id: 2,
					text: "Build something awesome",
					completed: false
				},
				{
					id: 3,
					text: "Integrate with TYPO3",
					completed: true
				}
			];
		};
		let nextId = 1;
		onMounted(() => {
			const container = document.querySelector("[data-component=\"TodoList\"]");
			if (container) {
				if (container.dataset.showDelete !== void 0 && container.dataset.showDelete !== "") config.value.showDelete = container.dataset.showDelete === "1";
				if (container.dataset.showFilter !== void 0 && container.dataset.showFilter !== "") config.value.showFilter = container.dataset.showFilter === "1";
				if (container.dataset.showClear !== void 0 && container.dataset.showClear !== "") config.value.showClear = container.dataset.showClear === "1";
				if (container.dataset.maxItems) config.value.maxItems = parseInt(container.dataset.maxItems) || 50;
				if (container.dataset.cardTitle) config.value.cardTitle = container.dataset.cardTitle;
				if (container.dataset.colorScheme) config.value.colorScheme = container.dataset.colorScheme;
				if (container.dataset.predefinedItems) config.value.predefinedItems = container.dataset.predefinedItems;
			}
			const fixedTodos = loadTodos().map((todo, index) => ({
				...todo,
				id: index + 1
			}));
			todos.value = fixedTodos;
			if (fixedTodos.length > 0) sessionStorage.setItem("todos", JSON.stringify(fixedTodos));
			nextId = fixedTodos.length + 1;
		});
		const newTodo = ref("");
		const filter = ref("all");
		const inputRef = ref(null);
		const announcement = ref("");
		watch(todos, (newTodos) => {
			sessionStorage.setItem("todos", JSON.stringify(newTodos));
		}, { deep: true });
		const filteredTodos = computed(() => {
			switch (filter.value) {
				case "active": return todos.value.filter((todo) => !todo.completed);
				case "completed": return todos.value.filter((todo) => todo.completed);
				default: return todos.value;
			}
		});
		const activeTodosCount = computed(() => {
			return todos.value.filter((todo) => !todo.completed).length;
		});
		const hasCompletedTodos = computed(() => {
			return todos.value.some((todo) => todo.completed);
		});
		function addTodo() {
			const text = newTodo.value.trim();
			if (text) {
				if (config.value.maxItems && todos.value.length >= config.value.maxItems) {
					announcement.value = t.value.maxReached.replace("{max}", config.value.maxItems);
					return;
				}
				todos.value.push({
					id: nextId++,
					text,
					completed: false
				});
				announcement.value = `${t.value.addedTask}: ${text}`;
				newTodo.value = "";
				nextTick(() => {
					inputRef.value?.focus();
				});
			}
		}
		function toggleTodo(id) {
			const todo = todos.value.find((t) => t.id === id);
			if (todo) {
				todo.completed = !todo.completed;
				announcement.value = todo.completed ? `${t.value.markedCompleted}: "${todo.text}"` : `${t.value.markedActive}: "${todo.text}"`;
			}
		}
		function deleteTodo(id) {
			const todo = todos.value.find((t) => t.id === id);
			if (todo) {
				announcement.value = `${t.value.deletedTask}: ${todo.text}`;
				todos.value = todos.value.filter((t) => t.id !== id);
				nextTick(() => {
					inputRef.value?.focus();
				});
			}
		}
		function clearCompleted() {
			const count = todos.value.filter((t) => t.completed).length;
			todos.value = todos.value.filter((todo) => !todo.completed);
			const taskWord = count === 1 ? t.value.task : t.value.tasks;
			announcement.value = `${t.value.cleared} ${count} ${taskWord}`;
			nextTick(() => {
				inputRef.value?.focus();
			});
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("section", _hoisted_1, [
				createBaseVNode("div", _hoisted_2, toDisplayString(announcement.value), 1),
				createBaseVNode("div", { class: normalizeClass(`card-header bg-${config.value.colorScheme} text-white py-3`) }, [createBaseVNode("h2", _hoisted_3, toDisplayString(config.value.cardTitle || t.value.cardTitle), 1)], 2),
				createBaseVNode("div", _hoisted_4, [
					createBaseVNode("form", {
						onSubmit: withModifiers(addTodo, ["prevent"]),
						class: "mb-4",
						"aria-label": "Add new todo"
					}, [
						createBaseVNode("label", _hoisted_5, toDisplayString(t.value.placeholder), 1),
						createBaseVNode("div", _hoisted_6, [withDirectives(createBaseVNode("input", {
							id: "new-todo-input",
							ref_key: "inputRef",
							ref: inputRef,
							"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => newTodo.value = $event),
							type: "text",
							class: "form-control",
							placeholder: t.value.placeholder,
							"aria-describedby": "todo-help"
						}, null, 8, _hoisted_7), [[vModelText, newTodo.value]]), createBaseVNode("button", {
							type: "submit",
							class: "btn btn-success h-100",
							style: { "min-width": "100px" },
							disabled: !newTodo.value.trim(),
							"aria-label": newTodo.value.trim() ? t.value.add : t.value.placeholder
						}, toDisplayString(t.value.add), 9, _hoisted_8)]),
						createBaseVNode("small", _hoisted_9, toDisplayString(t.value.placeholder), 1)
					], 32),
					config.value.showFilter ? (openBlock(), createElementBlock("div", _hoisted_10, [createBaseVNode("div", _hoisted_11, [
						createBaseVNode("input", {
							type: "radio",
							class: "btn-check",
							name: "filter",
							id: "filter-all",
							autocomplete: "off",
							checked: filter.value === "all",
							onChange: _cache[1] || (_cache[1] = ($event) => filter.value = "all"),
							"aria-label": t.value.showAll
						}, null, 40, _hoisted_12),
						createBaseVNode("label", _hoisted_13, [createTextVNode(toDisplayString(t.value.all) + " ", 1), createBaseVNode("span", {
							class: "badge bg-secondary badge-circle",
							"aria-label": `${todos.value.length} ${t.value.totalTasks}`
						}, toDisplayString(todos.value.length), 9, _hoisted_14)]),
						createBaseVNode("input", {
							type: "radio",
							class: "btn-check",
							name: "filter",
							id: "filter-active",
							autocomplete: "off",
							checked: filter.value === "active",
							onChange: _cache[2] || (_cache[2] = ($event) => filter.value = "active"),
							"aria-label": t.value.showActive
						}, null, 40, _hoisted_15),
						createBaseVNode("label", _hoisted_16, [createTextVNode(toDisplayString(t.value.active) + " ", 1), createBaseVNode("span", {
							class: "badge badge-warning badge-circle",
							"aria-label": `${activeTodosCount.value} ${t.value.activeTasks}`
						}, toDisplayString(activeTodosCount.value), 9, _hoisted_17)]),
						createBaseVNode("input", {
							type: "radio",
							class: "btn-check",
							name: "filter",
							id: "filter-completed",
							autocomplete: "off",
							checked: filter.value === "completed",
							onChange: _cache[3] || (_cache[3] = ($event) => filter.value = "completed"),
							"aria-label": t.value.showCompleted
						}, null, 40, _hoisted_18),
						createBaseVNode("label", _hoisted_19, [createTextVNode(toDisplayString(t.value.done) + " ", 1), createBaseVNode("span", {
							class: "badge badge-success badge-circle",
							"aria-label": `${todos.value.length - activeTodosCount.value} ${t.value.completedTasks}`
						}, toDisplayString(todos.value.length - activeTodosCount.value), 9, _hoisted_20)])
					])])) : createCommentVNode("", true),
					filteredTodos.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_21, [createBaseVNode("p", _hoisted_22, toDisplayString(filter.value === "all" ? t.value.emptyAll : filter.value === "active" ? t.value.emptyActive : t.value.emptyCompleted), 1)])) : (openBlock(), createElementBlock("ul", _hoisted_23, [(openBlock(true), createElementBlock(Fragment, null, renderList(filteredTodos.value, (todo) => {
						return openBlock(), createElementBlock("li", {
							key: todo.id,
							class: normalizeClass(["list-group-item d-flex align-items-center gap-3 py-3 border-start-0 border-end-0", { "todo-completed": todo.completed }]),
							role: "listitem"
						}, [
							createBaseVNode("div", _hoisted_24, [createBaseVNode("input", {
								type: "checkbox",
								id: `todo-${todo.id}`,
								checked: todo.completed,
								onChange: ($event) => toggleTodo(todo.id),
								class: "form-check-input",
								role: "switch",
								"aria-label": t.value.markAs.replace("{text}", todo.text).replace("{state}", todo.completed ? t.value.active : t.value.done),
								"aria-checked": todo.completed,
								style: {
									"cursor": "pointer",
									"width": "3em",
									"height": "1.5em"
								}
							}, null, 40, _hoisted_25)]),
							createBaseVNode("label", {
								for: `todo-${todo.id}`,
								class: normalizeClass(["flex-grow-1 mb-0 user-select-none", {
									"text-decoration-line-through text-muted": todo.completed,
									"fw-semibold": !todo.completed
								}]),
								style: { "cursor": "pointer" }
							}, toDisplayString(todo.text), 11, _hoisted_26),
							config.value.showDelete ? (openBlock(), createElementBlock("button", {
								key: 0,
								onClick: ($event) => deleteTodo(todo.id),
								class: "btn btn-sm btn-outline-primary opacity-75 hover-opacity-100",
								style: {
									"min-width": "70px",
									"white-space": "nowrap"
								},
								"aria-label": `${t.value.delete} ${todo.text}`,
								title: `${t.value.delete} ${todo.text}`
							}, toDisplayString(t.value.delete), 9, _hoisted_27)) : createCommentVNode("", true)
						], 2);
					}), 128))])),
					todos.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_28, [createBaseVNode("span", _hoisted_29, [
						createBaseVNode("strong", null, toDisplayString(activeTodosCount.value), 1),
						createTextVNode(" " + toDisplayString(activeTodosCount.value === 1 ? t.value.task : t.value.tasks) + " " + toDisplayString(t.value.remaining) + " ", 1),
						config.value.maxItems ? (openBlock(), createElementBlock("span", _hoisted_30, "(" + toDisplayString(t.value.max) + ": " + toDisplayString(config.value.maxItems) + ")", 1)) : createCommentVNode("", true)
					]), config.value.showClear && hasCompletedTodos.value ? (openBlock(), createElementBlock("button", {
						key: 0,
						onClick: clearCompleted,
						class: "btn btn-sm btn-primary",
						style: {
							"min-width": "140px",
							"white-space": "nowrap"
						},
						"aria-label": `${t.value.clearCompleted} (${todos.value.length - activeTodosCount.value})`
					}, toDisplayString(t.value.clearCompleted), 9, _hoisted_31)) : createCommentVNode("", true)])) : createCommentVNode("", true)
				])
			]);
		};
	}
}, [["__scopeId", "data-v-4c86b10c"]]);
//#endregion
export { TodoList_default as default };

//# sourceMappingURL=TodoList-CYMAZxKQ.js.map