<?php

namespace AppBundle\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DashboardController extends Controller
{

	/**
	 * @Route("/admin/dashboard", name="dashboard")
	 * @return Response
	 */
	public function indexAction()
	{
		/*return $this->render( 'dashboard.html.twig', [
			'name' => $slug
		]);*/

		$em = $this->getDoctrine()->getManager();

		$nbSalons = $em->getRepository('AppBundle:Salon')
					   ->createQueryBuilder('t')
					   ->select('count(t.id)')
					   ->getQuery()->getSingleScalarResult();

		$nbOeuvres = $em->getRepository('AppBundle:Oeuvre')
					   ->createQueryBuilder('t')
					   ->select('count(t.id)')
					   ->getQuery()->getSingleScalarResult();


        return $this->render('admin/dashboard.html.twig', array(
            'nbSalons' => $nbSalons,
            'nbOeuvres' => $nbOeuvres,
        ));
	}



}