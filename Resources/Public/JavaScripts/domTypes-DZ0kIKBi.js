// Assets/Scripts/code/Utils/domTypes.ts
function asHTMLElement(element) {
	return element instanceof HTMLElement ? element : null;
}
function eventTargetElement(event) {
	const target = event.target;
	return target instanceof Element ? target : null;
}
export { eventTargetElement as n, asHTMLElement as t };

//# sourceMappingURL=domTypes-DZ0kIKBi.js.map