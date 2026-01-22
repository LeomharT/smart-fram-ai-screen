import { APIS } from '@/constant/host';
import type { AlgorithmResult, AnalysisResult } from '@/types/analysis.type';
import fetchData from '@/utils/fetchData';

export async function getAnalysisResult() {
  const res = await fetchData<AnalysisResult>(APIS.ANALYSIS.RESULT);
  return res?.data;
}

export async function getAlgorithm() {
  const res = await fetchData<AlgorithmResult>(APIS.ANALYSIS.ALGORIGHM);
  return res?.data;
}
