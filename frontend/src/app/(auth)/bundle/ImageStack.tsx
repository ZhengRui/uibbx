import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { XCircleIcon } from "@heroicons/react/24/solid";

import Image from "next/image";

const ImageStack = ({
  images,
  setImages,
}: {
  images: { url: string; file: File | null }[];
  setImages: Function;
}) => {
  const onDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) {
      return;
    }

    const imagesReordered = [...images];
    const [removed] = imagesReordered.splice(result.source.index, 1);
    imagesReordered.splice(result.destination.index, 0, removed);

    setImages(imagesReordered);
  };

  const removeImage = (index: number) => {
    const imagesRemoved = [...images];
    imagesRemoved.splice(index, 1);

    setImages(imagesRemoved);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {images.map((image, index) => (
              <Draggable key={image.url} draggableId={image.url} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="relative w-full h-48 overflow-clip border rounded-2xl group"
                  >
                    <Image
                      src={image.url}
                      alt={image.url}
                      fill={true}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />

                    <div
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-8 h-8 text-orange-700 hover:text-orange-600 hidden group-hover:block cursor-pointer"
                    >
                      <XCircleIcon />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ImageStack;
