/**
 * packageName    : frontend.src.components.admin.editor
 * fileName       : RichTextEditor.tsx
 * author         : Song
 * date           : 2026-08-04
 * description    : 관리자 공통 Tiptap Rich Text 편집기 컴포넌트
 *                  - Research, About 등 장문 HTML 콘텐츠 작성
 *                  - 제목, 문단, 글자 서식, 목록, 인용문 및 코드 블록 제공
 *                  - 링크, 실행 취소 및 다시 실행 기능 제공
 *                  - 외부 HTML 값과 편집기 상태 동기화
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song               최초 생성
 */

import { useEffect, useRef } from 'react'
import {
  EditorContent,
  useEditor,
  useEditorState,
} from '@tiptap/react'
import type { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extensions'
import styles from './RichTextEditor.module.css'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  disabled?: boolean
  ariaLabel?: string
}

interface RichTextToolbarProps {
  editor: Editor
  disabled: boolean
}


function RichTextToolbar({
  editor,
  disabled,
}: RichTextToolbarProps) {
  const editorState = useEditorState({
    editor,
    // 에디터의 특정 상태만 선택하여 가져옴
    selector: ({ editor: currentEditor }) => ({
      isParagraph: currentEditor.isActive('paragraph'),
      isHeading2: currentEditor.isActive(
        'heading',
        { level: 2 },
      ),
      isHeading3: currentEditor.isActive(
        'heading',
        { level: 3 },
      ),
      isBold: currentEditor.isActive('bold'),
      isItalic: currentEditor.isActive('italic'),
      isStrike: currentEditor.isActive('strike'),
      isBlockquote: currentEditor.isActive('blockquote'),
      isBulletList: currentEditor.isActive('bulletList'),
      isOrderedList: currentEditor.isActive('orderedList'),
      isCodeBlock: currentEditor.isActive('codeBlock'),
      isLink: currentEditor.isActive('link'),
      canUndo: currentEditor
        .can()
        .chain()
        .undo()
        .run(),
      canRedo: currentEditor
        .can()
        .chain()
        .redo()
        .run(),
    }),
  })

  function getButtonClassName(
    active: boolean,
  ) {
    return active
      ? `${styles.toolbarButton} ${styles.toolbarButtonActive}`
      : styles.toolbarButton
  }

  function handleSetLink() {
    const previousHref =
      editor.getAttributes('link').href as string | undefined

    const href = window.prompt(
      '연결할 URL을 입력하세요.',
      previousHref ?? 'https://',
    )

    if (href === null) {
      return
    }

    const trimmedHref = href.trim()

    if (!trimmedHref) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .unsetLink()
        .run()

      return
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({
        href: trimmedHref,
      })
      .run()
  }

  function handleRemoveLink() {
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .unsetLink()
      .run()
  }

  return (
    <div
      className={styles.toolbar}
      role="toolbar"
      aria-label="본문 서식 도구"
    >
      <div className={styles.toolbarGroup}>
        <button
          type="button"
          className={getButtonClassName(
            editorState.isParagraph,
          )}
          aria-pressed={editorState.isParagraph}
          onClick={() =>
            editor
              .chain()
              .focus()
              .setParagraph()
              .run()
          }
          disabled={disabled}
        >
          본문
        </button>

        <button
          type="button"
          className={getButtonClassName(
            editorState.isHeading2,
          )}
          aria-pressed={editorState.isHeading2}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run()
          }
          disabled={disabled}
        >
          H2
        </button>

        <button
          type="button"
          className={getButtonClassName(
            editorState.isHeading3,
          )}
          aria-pressed={editorState.isHeading3}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 3 })
              .run()
          }
          disabled={disabled}
        >
          H3
        </button>
      </div>

      <div className={styles.toolbarGroup}>
        <button
          type="button"
          className={getButtonClassName(
            editorState.isBold,
          )}
          aria-pressed={editorState.isBold}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          disabled={disabled}
        >
          굵게
        </button>

        <button
          type="button"
          className={getButtonClassName(
            editorState.isItalic,
          )}
          aria-pressed={editorState.isItalic}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          disabled={disabled}
        >
          기울임
        </button>

        <button
          type="button"
          className={getButtonClassName(
            editorState.isStrike,
          )}
          aria-pressed={editorState.isStrike}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleStrike()
              .run()
          }
          disabled={disabled}
        >
          취소선
        </button>
      </div>

      <div className={styles.toolbarGroup}>
        <button
          type="button"
          className={getButtonClassName(
            editorState.isBulletList,
          )}
          aria-pressed={editorState.isBulletList}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          disabled={disabled}
        >
          글머리
        </button>

        <button
          type="button"
          className={getButtonClassName(
            editorState.isOrderedList,
          )}
          aria-pressed={editorState.isOrderedList}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
          disabled={disabled}
        >
          번호
        </button>

        <button
          type="button"
          className={getButtonClassName(
            editorState.isBlockquote,
          )}
          aria-pressed={editorState.isBlockquote}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBlockquote()
              .run()
          }
          disabled={disabled}
        >
          인용
        </button>

        <button
          type="button"
          className={getButtonClassName(
            editorState.isCodeBlock,
          )}
          aria-pressed={editorState.isCodeBlock}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleCodeBlock()
              .run()
          }
          disabled={disabled}
        >
          코드
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() =>
            editor
              .chain()
              .focus()
              .setHorizontalRule()
              .run()
          }
          disabled={disabled}
        >
          구분선
        </button>
      </div>

      <div className={styles.toolbarGroup}>
        <button
          type="button"
          className={getButtonClassName(
            editorState.isLink,
          )}
          aria-pressed={editorState.isLink}
          onClick={handleSetLink}
          disabled={disabled}
        >
          링크
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={handleRemoveLink}
          disabled={
            disabled ||
            !editorState.isLink
          }
        >
          링크 해제
        </button>
      </div>

      <div className={styles.toolbarGroup}>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() =>
            editor
              .chain()
              .focus()
              .undo()
              .run()
          }
          disabled={
            disabled ||
            !editorState.canUndo
          }
        >
          실행 취소
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() =>
            editor
              .chain()
              .focus()
              .redo()
              .run()
          }
          disabled={
            disabled ||
            !editorState.canRedo
          }
        >
          다시 실행
        </button>
      </div>
    </div>
  )
}

function RichTextEditor({
  value,
  onChange,
  placeholder = '본문을 입력하세요.',
  disabled = false,
  ariaLabel = '본문 편집기',
}: RichTextEditorProps) {
  /*
   * 부모 컴포넌트가 다시 렌더링될 때마다 전달받은
   * onChange 함수가 변경되어 편집기가 재생성되는 것을 방지
   */
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        /*
         * 백엔드 RichTextHtmlSanitizer가 허용하는
         * h2, h3만 편집기 제목으로 제공한다.
         */
        heading: {
          levels: [2, 3],
        },

        /*
         * StarterKit v3에는 underline이 포함되지만
         * 현재 백엔드 Sanitizer 정책에서 u 태그를 허용하지 않으므로
         * 편집기에서도 비활성화한다.
         */
        underline: false,

        link: {
          openOnClick: false,
        },
      }),

      Placeholder.configure({
        placeholder,
      }),
    ],

    content: value?.trim()
      ? value
      : '<p></p>',

    editable: !disabled,

    editorProps: {
      attributes: {
        class: styles.editor,
        role: 'textbox',
        'aria-label': ariaLabel,
        'aria-multiline': 'true',
      },
    },

    onUpdate: ({ editor: currentEditor }) => {
      const html = currentEditor.getHTML()

      /*
       * Tiptap 트랜잭션 처리 중 React 상태를 직접 갱신할 때
       * 발생할 수 있는 동기 렌더링 경고를 피하기 위해
       * 현재 HTML 값을 마이크로태스크에서 부모로 전달한다.
       */
      queueMicrotask(() => {
        onChangeRef.current(html)
      })
    },
  })

  /*
   * 수정 화면에서 API 상세 데이터가 비동기로 도착하거나
   * 폼 초기화로 value가 외부에서 변경될 때 편집기 내용을 맞춘다.
   */
  useEffect(() => {
    if (!editor) {
      return
    }

    const nextContent = value?.trim()
      ? value
      : '<p></p>'

    if (editor.getHTML() === nextContent) {
      return
    }

    editor.commands.setContent(
      nextContent,
      {
        emitUpdate: false,
      },
    )
  }, [editor, value])

  /*
   * 등록 요청 처리 중 disabled 값이 바뀌면
   * 기존 Editor 인스턴스를 재생성하지 않고 편집 가능 상태만 변경한다.
   */
  useEffect(() => {
    if (!editor) {
      return
    }

    editor.setEditable(
      !disabled,
      false,
    )
  }, [disabled, editor])

  if (!editor) {
    return (
      <div className={styles.loading}>
        편집기를 준비하는 중입니다...
      </div>
    )
  }

  return (
    <div
      className={
        disabled
          ? `${styles.wrapper} ${styles.wrapperDisabled}`
          : styles.wrapper
      }
    >
      <RichTextToolbar
        editor={editor}
        disabled={disabled}
      />

      <EditorContent editor={editor} />
    </div>
  )
}

export default RichTextEditor