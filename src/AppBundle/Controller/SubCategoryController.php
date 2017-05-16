<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Category;

use AppBundle\Entity\SubCategory;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;

/**
 * Subcategory controller.
 *
 */
class SubCategoryController extends Controller
{
    /**
     * Lists all subCategory entities.
     *
     * @Route("/admin/subcategories", name="subcategory_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $subCategories = $em->getRepository('AppBundle:SubCategory')->findAll();
        
        return $this->render('subcategory/index.html.twig', array(
            'subCategories' => $subCategories,
        ));
    }

    /**
     * Creates a new subCategory entity.
     *
     * @Route("/admin/subcategory/new", name="subcategory_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $subCategory = new Subcategory();
        $form = $this->createForm('AppBundle\Form\SubCategoryType', $subCategory);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($subCategory);
            $em->flush();

            return $this->redirectToRoute('subcategory_show', array('id' => $subCategory->getId()));
        }

        return $this->render('subcategory/new.html.twig', array(
            'subCategory' => $subCategory,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a subCategory entity.
     *
     * @Route("/admin/subcategory/{id}", name="subcategory_show")
     * @Method("GET")
     */
    public function showAction(SubCategory $subCategory)
    {
        $deleteForm = $this->createDeleteForm($subCategory);

        $categoryName = $subCategory->getCategory()->getName();

        return $this->render('subcategory/show.html.twig', array(
            'subCategory' => $subCategory,
            'categoryName' => $categoryName,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing subCategory entity.
     *
     * @Route("/admin/subcategory/{id}/edit", name="subcategory_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, SubCategory $subCategory)
    {
        $deleteForm = $this->createDeleteForm($subCategory);
        $editForm = $this->createForm('AppBundle\Form\SubCategoryType', $subCategory);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('subcategory_edit', array('id' => $subCategory->getId()));
        }

        return $this->render('subcategory/edit.html.twig', array(
            'subCategory' => $subCategory,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a subCategory entity.
     *
     * @Route("/admin/subcategory/{id}", name="subcategory_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, SubCategory $subCategory)
    {
        $form = $this->createDeleteForm($subCategory);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($subCategory);
            $em->flush();
        }

        return $this->redirectToRoute('subcategory_index');
    }

    /**
     * Creates a form to delete a subCategory entity.
     *
     * @param SubCategory $subCategory The subCategory entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(SubCategory $subCategory)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('subcategory_delete', array('id' => $subCategory->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }
}
