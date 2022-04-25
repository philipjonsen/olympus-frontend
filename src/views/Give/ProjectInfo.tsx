import { Project } from "src/components/GiveProject/project.type";
import ProjectCard, { ProjectDetailsMode } from "src/components/GiveProject/ProjectCard";
import { ChangeAssetType } from "src/slices/interfaces";

type ProjectInfoProps = {
  project: Project;
  giveAssetType: string;
  changeAssetType: ChangeAssetType;
  changeComponent: (newComponent: string) => void;
};

export default function ProjectInfo({ project, giveAssetType, changeAssetType, changeComponent }: ProjectInfoProps) {
  return (
    <ProjectCard
      project={project}
      giveAssetType={giveAssetType}
      changeAssetType={changeAssetType}
      changeComponent={changeComponent}
      mode={ProjectDetailsMode.Page}
    />
  );
}
