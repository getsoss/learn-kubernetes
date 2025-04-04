"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import "./globals.css";
import { Modal } from "./components/Modal";
import { useModal } from "./hooks/useModal";

// 클라이언트 사이드에서만 로드되도록 설정
const Terminal = dynamic(() => import("../app/components/Terminal"), {
  ssr: false,
});

export default function TerminalPage() {
  const { isOpen, openModal, closeModal } = useModal();

  // 페이지가 처음 렌더링될 때 모달 자동으로 열기
  useEffect(() => {
    openModal();
  }, [openModal]);

  return (
    <div className="bg-blue-100 h-screen w-screen p-4">
      <Terminal />

      <Modal isOpen={isOpen} onClose={closeModal}>
        <h2 className="text-xl font-semibold mb-4">안녕하세요!</h2>
        <p>
          이 페이지에서는 Kubernetes의 명령어들을 직접 타이핑하면서 리소스들을
          확인할 수 있습니다! 도움말들을 더 확인하고 싶다면 다음 버튼을 눌러
          주세요!{" "}
        </p>
      </Modal>
    </div>
  );
}
