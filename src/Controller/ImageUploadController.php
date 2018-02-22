<?php

namespace App\Controller;

use App\Entity\Image;
use League\Flysystem\FileNotFoundException;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;

class ImageUploadController extends AbstractController
{
    /**
     * @Route("/", name="image_index")
     * @return Response
     */
    public function index()
    {
        $em = $this->getDoctrine()->getManager();
        $imageRepo = $em->getRepository('App:Image');
        $images = $imageRepo->findAll();

        return $this->render('index.html.twig', compact('images'));
    }

    /**
     * @Route("/upload", name="image_upload")
     * @param Request $request
     * @return Response
     */
    public function create(Request $request)
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
     * @Route("/edit/{id}", name="image_update")
     * @param Request $request
     * @param Image $image
     * @return Response
     */
    public function update(Request $request, Image $image)
    {
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

        return $this->render('edit.html.twig', compact('form', 'image'));
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

        return $this->redirectToRoute('image_index');
    }

    /**
     * @Route("/remove/{id}")
     * @param Image $image
     * @param CacheManager $cacheManager
     * @param UploaderHelper $uploaderHelper
     * @return JsonResponse
     */
    public function remove(Image $image, CacheManager $cacheManager, UploaderHelper $uploaderHelper)
    {
        try {
            $filesystem = $this->container->get('oneup_flysystem.mount_manager')->getFilesystem('default_uploads');
            $filesystem->delete($uploaderHelper->asset($image, 'imageFile'));
        } catch (NotFoundExceptionInterface $e) {
        } catch (ContainerExceptionInterface $e) {
        } catch (FileNotFoundException $e) {
        }
        $cacheManager->remove($uploaderHelper->asset($image, 'imageFile'));

        return new JsonResponse(
            [
                'status' => 'success',
                'message' => 'Image Removed',
            ]
        );
    }
}
