<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Oeuvre;
use AppBundle\Entity\SubCategory;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
// Json handler
use Symfony\Component\HttpFoundation\JsonResponse;

//upload
use Symfony\Component\HttpFoundation\File\UploadedFile;


/**
 * Oeuvre controller.
 *
 */
class OeuvreController extends Controller
{
    /**
     * Lists all oeuvre entities.
     *
     * @Route("/admin/oeuvres", name="oeuvre_index", options={"expose"=true})
     * @Method({"GET", "POST"})
     */
    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $oeuvres = $em->getRepository('AppBundle:Oeuvre')->findAll();

        $nbTrendingOeuvres = $em->getRepository('AppBundle:Oeuvre')
                       ->createQueryBuilder('t')
                       ->select('count(t.id)')
                       ->where('t.trends = true')
                       ->getQuery()->getSingleScalarResult();
            $oeuvre = $em->getRepository('AppBundle:Oeuvre')->find(2);

        dump($nbTrendingOeuvres);

        if( $request->getMethod() == 'POST' )
        {
            // get the id send by ajax
            $oeuvre_id = (int)$request->request->get('oeuvre_id');
            $oeuvre = $em->getRepository('AppBundle:Oeuvre')->find($oeuvre_id);

            $trendsStatus = $oeuvre->getTrends();
            // Change trends status
            if( $nbTrendingOeuvres == 6 )
            {
                if( $trendsStatus )
                {
                    $oeuvre->setTrends(false);

                }

            }
            elseif( $nbTrendingOeuvres < 6 )
            {
                if( $trendsStatus )
                {
                    $oeuvre->setTrends(false);
                }
                else
                {
                    $oeuvre->setTrends(true);                    
                }                
            }

            // update
            $em->persist($oeuvre);
            $em->flush();
            $response = $oeuvre->getTrends();


            return new JsonResponse($response);
        }

        return $this->render('oeuvre/index.html.twig', array(
            'oeuvres' => $oeuvres,
            'nbTrendingOeuvres' => $nbTrendingOeuvres,
        ));
    }

    /**
     * Creates a new oeuvre entity.
     *
     * @Route("/admin/oeuvre/new", name="oeuvre_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $oeuvre = new Oeuvre();
        $form = $this->createForm('AppBundle\Form\OeuvreType', $oeuvre);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            // $file stores the uploaded PDF file
            /** @var Symfony\Component\HttpFoundation\File\UploadedFile $file */
            $file = $oeuvre->getUrlImage();
            //dump($file);

            // Generate a unique name for the file before saving it
            $fileName = md5(uniqid()).'.'.$file->guessExtension();
            // Move the file to the directory where brochures are stored
            $file->move(
                $this->getParameter('oeuvres_directory'),
                $fileName
            );

            // Update the 'brochure' property to store the PDF file name
            // instead of its contents
            $oeuvre->setUrlImage($fileName);

            $em = $this->getDoctrine()->getManager();
            $em->persist($oeuvre);
            $em->flush();

            // Show notice
            $this->addFlash(
                'notice',
                'Oeuvre Added'
            );

            return $this->redirectToRoute('oeuvre_show', array('id' => $oeuvre->getId()));
        }

        return $this->render('oeuvre/new.html.twig', array(
            'oeuvre' => $oeuvre,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a oeuvre entity.
     *
     * @Route("/admin/oeuvre/{id}", name="oeuvre_show")
     * @Method("GET")
     */
    public function showAction(Oeuvre $oeuvre)
    {
        $deleteForm = $this->createDeleteForm($oeuvre);

        return $this->render('oeuvre/show.html.twig', array(
            'oeuvre' => $oeuvre,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing oeuvre entity.
     *
     * @Route("/admin/oeuvre/{id}/edit", name="oeuvre_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, Oeuvre $oeuvre)
    {
        $deleteForm = $this->createDeleteForm($oeuvre);
        $editForm = $this->createForm('AppBundle\Form\OeuvreType', $oeuvre);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {

            // $file stores the uploaded PDF file
            $file = $oeuvre->getUrlImage();

            if( $file !== null )
            {
                // Generate a unique name for the file before saving it
                $fileName = md5(uniqid()).'.'.$file->guessExtension();
                // Move the file to the directory where brochures are stored
                $file->move(
                    $this->getParameter('oeuvres_directory'),
                    $fileName
                );

                $oeuvre->setUrlImage($fileName);
            }
            else
            {
                /*$oldOeuvre = new Oeuvre();
                $oldOeuvre = $this->getDoctrine()
                    ->getRepository('AppBundle:Oeuvre')
                    ->find($oeuvre->getId());
                $fileName = $oldOeuvre->getUrlImage();
                dump($fileName);
                die();*/
            }

            $this->getDoctrine()->getManager()->flush();

            // Show notice
            $this->addFlash(
                'notice',
                'Oeuvre Added'
            );

            return $this->redirectToRoute('oeuvre_edit', array('id' => $oeuvre->getId()));
        }

        return $this->render('oeuvre/edit.html.twig', array(
            'oeuvre' => $oeuvre,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a oeuvre entity.
     *
     * @Route("/{id}", name="oeuvre_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, Oeuvre $oeuvre)
    {
        $form = $this->createDeleteForm($oeuvre);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($oeuvre);
            $em->flush();

            // Show notice
            $this->addFlash(
                'notice',
                'Oeuvre Deleted'
            );
        }

        return $this->redirectToRoute('oeuvre_index');
    }

    /**
     * Creates a form to delete a oeuvre entity.
     *
     * @param Oeuvre $oeuvre The oeuvre entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(Oeuvre $oeuvre)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('oeuvre_delete', array('id' => $oeuvre->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }

}
