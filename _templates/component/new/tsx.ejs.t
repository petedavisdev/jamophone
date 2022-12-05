---
to: src/components/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.tsx
---

import styles from './<%= ComponentName = h.changeCase.pascal(name) %>.module.css';

type <%= ComponentName %>Props = {
	children: React.ReactNode;
};

export function <%= ComponentName %>(props: <%= ComponentName %>Props): JSX.Element {
	return <div className={styles.<%= ComponentName %>}>{props.children}</div>;
}