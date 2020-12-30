const slackifyMarkdown = require('..');

const zws = String.fromCharCode(0x200B); // zero-width-space

test('Simple text', () => {
  expect(slackifyMarkdown('hello world')).toBe('hello world\n');
});

test('Escaped text', () => {
  expect(slackifyMarkdown('*h&ello>world<')).toBe('*h&amp;ello&gt;world&lt;\n');
});

test('Headings', () => {
  const mrkdown = '# heading 1\n## heading 2\n### heading 3';
  const slack = '*heading 1*\n\n*heading 2*\n\n*heading 3*\n';
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Bold', () => {
  const mrkdown = '**bold text**';
  const slack = `${zws}*bold text*${zws}\n`;
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Bold character in word', () => {
  expect(slackifyMarkdown('he**l**lo')).toBe(`he${zws}*l*${zws}lo\n`);
});

test('Italic', () => {
  const mrkdown = '*italic text*';
  const slack = `${zws}_italic text_${zws}\n`;
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Bold+Italic', () => {
  const mrkdown = '***bold+italic***';
  const slack = `${zws}_${zws}*bold+italic*${zws}_${zws}\n`;
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Strike', () => {
  const mrkdown = '~~strike text~~';
  const slack = `${zws}~strike text~${zws}\n`;
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Unordered list', () => {
  const mrkdown = '* list\n* list\n* list';
  const slack = '•   list\n•   list\n•   list\n';
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Ordered list', () => {
  const mrkdown = '1. list\n2. list\n3. list';
  const slack = '1.  list\n2.  list\n3.  list\n';
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Link with title', () => {
  const mrkdown = '[test](http://atlassian.com)';
  const slack = '<http://atlassian.com|test>\n';
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Link with alt', () => {
  const mrkdown = '[test](http://atlassian.com "Atlassian")';
  const slack = '<http://atlassian.com|Atlassian>\n';
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Link with angle bracket syntax', () => {
  const mrkdown = '<http://atlassian.com>';
  const slack = '<http://atlassian.com|http://atlassian.com>\n';
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Link with no title nor alt', () => {
  const mrkdown = '[](http://atlassian.com)';
  const slack = '<http://atlassian.com>\n';
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Link with invalid URL', () => {
  const mrkdown = '[test](/atlassian)';
  const slack = '/atlassian\n';
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Image with title', () => {
  const mrkdown = '![logo.png](https://bitbucket.org/repo/123/images/logo.png)';
  const slack = '<https://bitbucket.org/repo/123/images/logo.png|logo.png>\n';
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Image with alt', () => {
  const mrkdown = "![logo.png](https://bitbucket.org/repo/123/images/logo.png 'test')";
  const slack = '<https://bitbucket.org/repo/123/images/logo.png|test>\n';
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Image with no alt nor title', () => {
  const mrkdown = '![](https://bitbucket.org/repo/123/images/logo.png)';
  const slack = '<https://bitbucket.org/repo/123/images/logo.png>\n';
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Image with invalid URL', () => {
  const mrkdown = "![logo.png](/relative-path-logo.png 'test')";
  const slack = '/relative-path-logo.png\n';
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Inline code', () => {
  const mrkdown = 'hello `world`';
  const slack = 'hello `world`\n';
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Code block', () => {
  const mrkdown = '```\ncode block\n```';
  const slack = '```\ncode block\n```\n';
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Code block with language', () => {
  const mrkdown = '```javascript\ncode block\n```';
  const slack = '```\ncode block\n```\n';
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});

test('Code block with deprecated language declaration', () => {
  const mrkdown = '```\n#!javascript\ncode block\n```';
  const slack = '```\ncode block\n```\n';
  expect(slackifyMarkdown(mrkdown)).toBe(slack);
});
