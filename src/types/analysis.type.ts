export interface AlgorithmResult {
  current_deployment: {
    last_deploy_time: string;
    model_identifier: string;
    model_name: string;
    model_version: string;
    status: string;
  };
  deployment_config: {
    confidence: string;
    model_code: string;
    model_file_path: string;
    model_id: number;
    model_labels: string;
    model_name: string;
    model_version: string;
    updated_at: string;
  };
}

export interface AnalysisResult {
  detectedLabels: string[];
  detectionTime: string;
  distribution: Record<string, number>;
  imageBase64: string;
  labelsDescriptionAndMeasures: Record<
    string,
    { description: string; measure: string }
  >;
}
