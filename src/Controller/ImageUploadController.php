<?php

namespace App\Controller;

use App\Entity\Image;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;

class ImageUploadController extends AbstractController
{
    /**
     * @Route("/", name="image_upload")
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $image = new Image();
        $form = $this->createForm('App\Form\ImageType', $image);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($image);
            $em->flush();

            return new JsonResponse(
                [
                    'status' => 'success',
                    'message' => 'Image Uploaded',
                    'data' => [
                        'id' => $image->getId(),
                    ],
                ]
            );
        }
        $form = $form->createView();

        return $this->render('upload.html.twig', compact('form'));
    }

    /**
     * @Route("/show/{id}", name="image_show")
     * @param Image $image
     * @return Response
     */
    public function show(Image $image)
    {
        return $this->render('show.html.twig', compact('image'));
    }

    /**
     * @Route("/delete/{id}", name="image_delete")
     * @param Image $image
     * @param CacheManager $cacheManager
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function delete(Image $image, CacheManager $cacheManager, UploaderHelper $uploaderHelper)
    {
        $cacheManager->remove($uploaderHelper->asset($image, 'imageFile'));
        $em = $this->getDoctrine()->getManager();
        $em->remove($image);
        $em->flush();

        return $this->redirectToRoute('image_upload');
    }
}
