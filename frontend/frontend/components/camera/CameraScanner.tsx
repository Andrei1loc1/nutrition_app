"use client";

import { useEffect, useRef, useState } from "react";
import {
  addScanToJournal,
  predictMeal,
  savePredictionScan,
  uploadScanImage,
  type PredictionResult,
} from "@/lib/predict";
import { useCameraScanner } from "@/hooks/useCameraScanner";
import { dataURLtoFile } from "@/lib/utils/image";
import CameraPreview from "./CameraPreview";
import PredictionPanel from "./PredictionPanel";
import CameraError from "./CameraError";
import PortionSelectorModal, { type PortionValue } from "./PortionSelectorModal";

interface CameraScannerProps {
  onClose?: () => void;
}

export default function CameraScanner({ onClose }: CameraScannerProps) {
  const {
    videoRef,
    isLoading,
    error,
    isCameraActive,
    switchCamera,
    startCamera,
    capturedImage,
    capturePhoto,
    handleClose,
  } = useCameraScanner({ onCloseAction: onClose });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const processedCaptureRef = useRef<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [predictionInfo, setPredictionInfo] = useState<PredictionResult | null>(null);
  const [topPredictions, setTopPredictions] = useState<PredictionResult[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [savedScanId, setSavedScanId] = useState<string | null>(null);
  const [isAddingToJournal, setIsAddingToJournal] = useState(false);
  const [journalStatus, setJournalStatus] = useState<string | null>(null);
  const [scanSaveStatus, setScanSaveStatus] = useState<string | null>(null);
  const [pendingPrediction, setPendingPrediction] = useState<PredictionResult | null>(null);
  const [showPortionModal, setShowPortionModal] = useState(false);

  // Rulează predicția automat după captură
  useEffect(() => {
    if (!capturedImage) return;
    if (processedCaptureRef.current === capturedImage) return;
    processedCaptureRef.current = capturedImage;

    const runPrediction = async () => {
      try {
        setIsPredicting(true);
        resetPredictionState();

        const file = dataURLtoFile(capturedImage, "capture.jpg");
        const result = await predictMeal(file, "full");

        const formatted = result.food_class
          ? result.food_class
          : JSON.stringify(result);

        setPrediction(formatted);
        setPredictionInfo(result);
        setTopPredictions(result.top_predictions || []);
      } catch (e) {
        console.error(e);
        setPrediction("Error identifying meal");
      } finally {
        setIsPredicting(false);
      }
    };

    runPrediction();
  }, [capturedImage]);

  function resetPredictionState() {
    setPrediction(null);
    setPredictionInfo(null);
    setSavedScanId(null);
    setJournalStatus(null);
    setScanSaveStatus(null);
  }

  const handleAddToJournal = (predictionToSave: PredictionResult) => {
    if (!capturedImage) return;
    setPendingPrediction(predictionToSave);
    setShowPortionModal(true);
  };

  const handleSaveWithPortion = async (portion: PortionValue) => {
    if (!capturedImage || !pendingPrediction) return;

    try {
      setIsAddingToJournal(true);
      setJournalStatus(null);

      const uploadedImage = await uploadScanImage(capturedImage);
      const savedScan = await savePredictionScan(pendingPrediction, uploadedImage);
      await addScanToJournal(savedScan.id, portion);

      setSavedScanId(savedScan.id);
      setJournalStatus("Added to journal");
      setShowPortionModal(false);
      setPendingPrediction(null);
    } catch (e) {
      console.error(e);
      setJournalStatus("Could not add to journal");
    } finally {
      setIsAddingToJournal(false);
    }
  };

  const handleSelectPrediction = (pred: PredictionResult) => {
    setSelectedPrediction(pred);
  };

  if (error) {
    return <CameraError error={error} onRetry={startCamera} />;
  }

  return (
    <div className="fixed inset-0 z-50 mx-auto h-dvh w-full max-w-[430px] overflow-hidden bg-black text-white">
      <CameraPreview
        videoRef={videoRef}
        isLoading={isLoading}
        isCameraActive={isCameraActive}
        onClose={handleClose}
        onCapture={capturePhoto}
        onSwitchCamera={switchCamera}
      />

      <PredictionPanel
        topPredictions={topPredictions}
        selectedPrediction={selectedPrediction}
        prediction={prediction}
        predictionInfo={predictionInfo}
        isPredicting={isPredicting}
        savedScanId={savedScanId}
        isAddingToJournal={isAddingToJournal}
        journalStatus={journalStatus}
        capturedImage={capturedImage}
        onSelectPrediction={handleSelectPrediction}
        onAddToJournal={handleAddToJournal}
      />

      <PortionSelectorModal
        isOpen={showPortionModal}
        onClose={() => {
          setShowPortionModal(false);
          setPendingPrediction(null);
          setIsAddingToJournal(false);
        }}
        onSave={handleSaveWithPortion}
        isSaving={isAddingToJournal}
      />
    </div>
  );
}
