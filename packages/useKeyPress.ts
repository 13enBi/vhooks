import { onMounted } from 'vue';
import useEventListener from './useEventListener';
import { isArray, isString } from './utils';

import { Target } from './utils';

export type KeyPredicate = (event: KeyboardEvent) => boolean;
export type keyType = KeyboardEvent['keyCode'] | KeyboardEvent['key'];
export type KeyFilter = keyType | Array<keyType> | ((event: KeyboardEvent) => boolean);
export type EventHandler = (event?: KeyboardEvent) => void;
export type keyEvent = 'keydown' | 'keyup';

export type EventOption = {
	event?: keyEvent;
	target?: Target;
};

const aliasKeyCodeMap = {
	esc: 27,
	tab: 9,
	enter: 13,
	space: 32,
	up: 38,
	left: 37,
	right: 39,
	down: 40,
	delete: [8, 46],
};

const aliasKeyMap = {
	esc: 'Escape',
	tab: 'Tab',
	enter: 'Enter',
	space: [' ', 'space'],
	up: ['Up', 'ArrowUp'],
	left: ['Left', 'ArrowLeft'],
	right: ['Right', 'ArrowRight'],
	down: ['Down', 'ArrowDown'],
	delete: ['Backspace', 'Delete'],
};

const modifierKey = {
	ctrl: (event: KeyboardEvent) => event.ctrlKey,
	shift: (event: KeyboardEvent) => event.shiftKey,
	alt: (event: KeyboardEvent) => event.altKey,
	meta: (event: KeyboardEvent) => event.metaKey,
};

const isKeyPress = (event: KeyboardEvent, key: String | Number) => {
	if (isString(key)) {
		const keyArr = key.split('.');
		let keyLen = keyArr.length;

		for (const keyCode of keyArr) {
			const genModifier = modifierKey[keyCode];

			const aliasKey = (aliasKeyMap as any)[keyCode],
				isAliaArr = isArray(aliasKey);

			const aliasKeyCode = aliasKeyCodeMap[keyCode],
				isAliaCodeArr = isArray(aliasKeyCode);

			const isKey = keyCode.toUpperCase() === event.key.toUpperCase(),
				isModifier = genModifier?.(event),
				isAliasKey = aliasKey && isAliaArr ? aliasKey.includes(event.key) : aliasKey === event.key,
				isAliasKeyCode =
					aliasKeyCode && isAliaCodeArr
						? aliasKeyCode.includes(event.keyCode)
						: aliasKeyCode === event.keyCode;

			(isKey || isModifier || isAliasKey || isAliasKeyCode) && keyLen--;
		}
		return keyLen === 0;
	} else {
		return event.keyCode === key;
	}
};

const keyFilter = (key: KeyFilter): KeyPredicate => {
	const type = typeof key;

	if (type === 'function') {
		return key as KeyPredicate;
	} else if (type === 'string' || type === 'number') {
		return (event) => isKeyPress(event, <string | number>key);
	} else if (isArray(key)) {
		return (event) => (<keyType[]>key).some((i) => isKeyPress(event, i));
	}

	return key ? () => true : () => false;
};

const useKeyPress = (key: KeyFilter, callback: EventHandler, options: EventOption = {}) => {
	const { event = 'keydown', target } = options;

	const keyHandler = (event: KeyboardEvent) => {
		keyFilter(key)(event) && callback(event);
	};

	onMounted(() => {
		useEventListener(event, keyHandler, { target });
	});
};

export default useKeyPress;
