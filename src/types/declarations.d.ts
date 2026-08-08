// Для SVG: импорт картинки даёт строку (путь к файлу)
declare module '*.svg' {
  const path: string;
  export default path;
}

// Твои существующие декларации для стилей
declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}
