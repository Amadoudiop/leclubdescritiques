<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Oeuvre;
use AppBundle\Entity\SubCategory;
use AppBundle\Entity\Statut;

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


        if( $request->getMethod() == 'POST' )
        {    
            $trends = $request->request->get('trends');
            $approve = $request->request->get('approve');

            if( $trends === 'true' )
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

                $response = $oeuvre->getTrends();
            }
            elseif( $approve === 'true' )
            {
                // get the id send by ajax
                $oeuvre_id = (int)$request->request->get('oeuvre_id');
                $oeuvre = $em->getRepository('AppBundle:Oeuvre')->find($oeuvre_id);
                
                $approvedStatus = $oeuvre->getApproved();

                if( $approvedStatus )
                {
                    $oeuvre->setApproved(false);
                }
                else
                {
                    $oeuvre->setApproved(true);
                }

                $response = $oeuvre->getApproved();
            }
            // update
            $em->persist($oeuvre);
            $em->flush();

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

        if ($form->isSubmitted() && $form->isValid())
        {
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
     * @Route("/oeuvre/{id}", name="oeuvre_show")
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
                'Oeuvre Edited'
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

    /**
     * @Route("/getBooksTrends", name="get_books_trends", options={"expose"=true})
     */
    public function getBooksTrendsAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        
        $books = $em->getRepository('AppBundle:Oeuvre')->findBy(['trends' => true]);

        $data = [];

        foreach ($books as $book) {
            $title = (empty($book->getTitle())) ? '' : $book->getTitle();
            $url_product = (empty($book->getUrlProduct())) ? '' : $book->getUrlProduct();
            $description = (empty($book->getDescription())) ? '' : $book->getDescription();
            $url_image = (empty($book->getUrlImage())) ? '' : $book->getUrlImage();
            $publication_date = (empty($book->getPublicationDate()->format('d/m/Y'))) ? '' : $book->getPublicationDate()->format('d/m/Y');
            $rating = (empty($book->getRating())) ? '' : $book->getRating();
            $author = (empty($book->getAuthor()->getFirstname())) ? '' : $book->getAuthor()->getFirstname();
            $category = (empty($book->getCategory()->getName())) ? '' : $book->getCategory()->getName();
            $sub_category = (empty($book->getSubCategory()->getName())) ? '' : $book->getSubCategory()->getName();
            $id = (empty($book->getId())) ? '' : $book->getId();

            $data[] = [
                'title' => $title,
                'url_product' => $url_product,
                'description' => $description,
                'url_image' => $url_image,
                'publication_date' => $publication_date,
                'rating' => $rating,
                'author' => $author,
                'category' => $category,
                'sub_category' => $sub_category,
                'id' => $id
             ];
        }

        return new JsonResponse($data);
    }

    /**
     * @Route("/getAllBooks", name="get_all_books", options={"expose"=true})
     */
    public function getAllBooksAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        
        $books = $em->getRepository('AppBundle:Oeuvre')->findAll();

        $data = [];

        foreach ($books as $book) {
            $title = (empty($book->getTitle())) ? '' : $book->getTitle();
            $url_product = (empty($book->getUrlProduct())) ? '' : $book->getUrlProduct();
            $description = (empty($book->getDescription())) ? '' : $book->getDescription();
            $url_image = (empty($book->getUrlImage())) ? '' : $book->getUrlImage();
            $publication_date = (empty($book->getPublicationDate()->format('d/m/Y'))) ? '' : $book->getPublicationDate()->format('d/m/Y');
            $rating = (empty($book->getRating())) ? '' : $book->getRating();
            $author = (empty($book->getAuthor()->getFirstname())) ? '' : $book->getAuthor()->getFirstname();
            $category = (empty($book->getCategory()->getName())) ? '' : $book->getCategory()->getName();
            $sub_category = (empty($book->getSubCategory()->getName())) ? '' : $book->getSubCategory()->getName();
            $id = (empty($book->getId())) ? '' : $book->getId();

            $data[] = [
                'title' => $title,
                'url_product' => $url_product,
                'description' => $description,
                'url_image' => $url_image,
                'publication_date' => $publication_date,
                'rating' => $rating,
                'author' => $author,
                'category' => $category,
                'sub_category' => $sub_category,
                'id' => $id
             ];
        }

        return new JsonResponse($data);
    }

}
